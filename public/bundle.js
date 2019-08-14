
(function(l, i, v, e) { v = l.createElement(i); v.async = 1; v.src = '//' + (location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; e = l.getElementsByTagName(i)[0]; e.parentNode.insertBefore(v, e)})(document, 'script');
var app = (function () {
    'use strict';

    function noop() { }
    function assign(tar, src) {
        // @ts-ignore
        for (const k in src)
            tar[k] = src[k];
        return tar;
    }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }

    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function empty() {
        return text('');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else
            node.setAttribute(attribute, value);
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_data(text, data) {
        data = '' + data;
        if (text.data !== data)
            text.data = data;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    function flush() {
        const seen_callbacks = new Set();
        do {
            // first, call beforeUpdate functions
            // and update components
            while (dirty_components.length) {
                const component = dirty_components.shift();
                set_current_component(component);
                update(component.$$);
            }
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    callback();
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
    }
    function update($$) {
        if ($$.fragment) {
            $$.update($$.dirty);
            run_all($$.before_update);
            $$.fragment.p($$.dirty, $$.ctx);
            $$.dirty = null;
            $$.after_update.forEach(add_render_callback);
        }
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }

    function get_spread_update(levels, updates) {
        const update = {};
        const to_null_out = {};
        const accounted_for = { $$scope: 1 };
        let i = levels.length;
        while (i--) {
            const o = levels[i];
            const n = updates[i];
            if (n) {
                for (const key in o) {
                    if (!(key in n))
                        to_null_out[key] = 1;
                }
                for (const key in n) {
                    if (!accounted_for[key]) {
                        update[key] = n[key];
                        accounted_for[key] = 1;
                    }
                }
                levels[i] = n;
            }
            else {
                for (const key in o) {
                    accounted_for[key] = 1;
                }
            }
        }
        for (const key in to_null_out) {
            if (!(key in update))
                update[key] = undefined;
        }
        return update;
    }
    function mount_component(component, target, anchor) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment.m(target, anchor);
        // onMount happens before the initial afterUpdate
        add_render_callback(() => {
            const new_on_destroy = on_mount.map(run).filter(is_function);
            if (on_destroy) {
                on_destroy.push(...new_on_destroy);
            }
            else {
                // Edge case - component was destroyed immediately,
                // most likely as a result of a binding initialising
                run_all(new_on_destroy);
            }
            component.$$.on_mount = [];
        });
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        if (component.$$.fragment) {
            run_all(component.$$.on_destroy);
            component.$$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            component.$$.on_destroy = component.$$.fragment = null;
            component.$$.ctx = {};
        }
    }
    function make_dirty(component, key) {
        if (!component.$$.dirty) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty = blank_object();
        }
        component.$$.dirty[key] = true;
    }
    function init(component, options, instance, create_fragment, not_equal, prop_names) {
        const parent_component = current_component;
        set_current_component(component);
        const props = options.props || {};
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props: prop_names,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            before_update: [],
            after_update: [],
            context: new Map(parent_component ? parent_component.$$.context : []),
            // everything else
            callbacks: blank_object(),
            dirty: null
        };
        let ready = false;
        $$.ctx = instance
            ? instance(component, props, (key, value) => {
                if ($$.ctx && not_equal($$.ctx[key], $$.ctx[key] = value)) {
                    if ($$.bound[key])
                        $$.bound[key](value);
                    if (ready)
                        make_dirty(component, key);
                }
            })
            : props;
        $$.update();
        ready = true;
        run_all($$.before_update);
        $$.fragment = create_fragment($$.ctx);
        if (options.target) {
            if (options.hydrate) {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment.l(children(options.target));
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor);
            flush();
        }
        set_current_component(parent_component);
    }
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set() {
            // overridden by instance, if it has props
        }
    }
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error(`'target' is a required option`);
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn(`Component was already destroyed`); // eslint-disable-line no-console
            };
        }
    }

    /**
     * Create a `Writable` store that allows both updating and reading by subscription.
     * @param {*=}value initial value
     * @param {StartStopNotifier=}start start and stop notifications for subscriptions
     */
    function writable(value, start = noop) {
        let stop;
        const subscribers = [];
        function set(new_value) {
            if (safe_not_equal(value, new_value)) {
                value = new_value;
                if (!stop) {
                    return; // not ready
                }
                subscribers.forEach((s) => s[1]());
                subscribers.forEach((s) => s[0](value));
            }
        }
        function update(fn) {
            set(fn(value));
        }
        function subscribe(run, invalidate = noop) {
            const subscriber = [run, invalidate];
            subscribers.push(subscriber);
            if (subscribers.length === 1) {
                stop = start(set) || noop;
            }
            run(value);
            return () => {
                const index = subscribers.indexOf(subscriber);
                if (index !== -1) {
                    subscribers.splice(index, 1);
                }
                if (subscribers.length === 0) {
                    stop();
                    stop = null;
                }
            };
        }
        return { set, update, subscribe };
    }

    /** Tile type:
     *  {
     *    piece: [pieceTypeReference], // some rules might allow piece stacking
     *    accepts: [pieceTypeReference],
     *    id: number,
     *    isRosette: boolean
     *  },
     */
    let rowSet = [
      [
        { pieces: [], accepts: [pieceType[1]], id: 1, isRosette: true },
        { pieces: [], accepts: [pieceType[1]], id: 2 },
        { pieces: [], accepts: [pieceType[1]], id: 3 },
        { pieces: [], accepts: [pieceType[1]], id: 4 },
        { pieces: [], accepts: [], id: 5 },
        { pieces: [], accepts: [], id: 6 },
        { pieces: [], accepts: [pieceType[1]], id: 7, isRosette: true },
        { pieces: [], accepts: [pieceType[1]], id: 8 }
      ],
      [
        { pieces: [], accepts: [pieceType[1], pieceType[2]], id: 9 },
        { pieces: [], accepts: [pieceType[1], pieceType[2]], id: 10 },
        { pieces: [], accepts: [pieceType[1], pieceType[2]], id: 11 },
        {
          pieces: [],
          accepts: [pieceType[1], pieceType[2]],
          id: 12,
          isRosette: true
        },
        { pieces: [], accepts: [pieceType[1], pieceType[2]], id: 13 },
        { pieces: [], accepts: [pieceType[1], pieceType[2]], id: 14 },
        { pieces: [], accepts: [pieceType[1], pieceType[2]], id: 15 },
        { pieces: [], accepts: [pieceType[1], pieceType[2]], id: 16 }
      ],
      [
        { pieces: [], accepts: [pieceType[2]], id: 17, isRosette: true },
        { pieces: [], accepts: [pieceType[2]], id: 18 },
        { pieces: [], accepts: [pieceType[2]], id: 19 },
        { pieces: [], accepts: [pieceType[2]], id: 20 },
        { pieces: [], accepts: [], id: 21 },
        { pieces: [], accepts: [], id: 22 },
        { pieces: [], accepts: [pieceType[2]], id: 23, isRosette: true },
        { pieces: [], accepts: [pieceType[2]], id: 24 }
      ]
    ];

    const boardState = writable(rowSet);

    /* src\components\Piece.svelte generated by Svelte v3.6.8 */

    const file = "src\\components\\Piece.svelte";

    function create_fragment(ctx) {
    	var div, div_class_value;

    	return {
    		c: function create() {
    			div = element("div");
    			attr(div, "class", div_class_value = "piece " + (ctx.isBlack ? 'black' : 'white') + " svelte-1hvv81v");
    			add_location(div, file, 21, 0, 319);
    		},

    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},

    		m: function mount(target, anchor) {
    			insert(target, div, anchor);
    		},

    		p: function update(changed, ctx) {
    			if ((changed.isBlack) && div_class_value !== (div_class_value = "piece " + (ctx.isBlack ? 'black' : 'white') + " svelte-1hvv81v")) {
    				attr(div, "class", div_class_value);
    			}
    		},

    		i: noop,
    		o: noop,

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach(div);
    			}
    		}
    	};
    }

    function instance($$self, $$props, $$invalidate) {
    	let { id, type } = $$props;

    	const writable_props = ['id', 'type'];
    	Object.keys($$props).forEach(key => {
    		if (!writable_props.includes(key) && !key.startsWith('$$')) console.warn(`<Piece> was created with unknown prop '${key}'`);
    	});

    	$$self.$set = $$props => {
    		if ('id' in $$props) $$invalidate('id', id = $$props.id);
    		if ('type' in $$props) $$invalidate('type', type = $$props.type);
    	};

    	let isBlack;

    	$$self.$$.update = ($$dirty = { type: 1 }) => {
    		if ($$dirty.type) { $$invalidate('isBlack', isBlack = type === "black"); }
    	};

    	return { id, type, isBlack };
    }

    class Piece extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, ["id", "type"]);

    		const { ctx } = this.$$;
    		const props = options.props || {};
    		if (ctx.id === undefined && !('id' in props)) {
    			console.warn("<Piece> was created without expected prop 'id'");
    		}
    		if (ctx.type === undefined && !('type' in props)) {
    			console.warn("<Piece> was created without expected prop 'type'");
    		}
    	}

    	get id() {
    		throw new Error("<Piece>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set id(value) {
    		throw new Error("<Piece>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get type() {
    		throw new Error("<Piece>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set type(value) {
    		throw new Error("<Piece>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\components\Tile.svelte generated by Svelte v3.6.8 */

    const file$1 = "src\\components\\Tile.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = Object.create(ctx);
    	child_ctx.piece = list[i];
    	child_ctx.index = i;
    	return child_ctx;
    }

    // (33:2) {#if pieces.length}
    function create_if_block(ctx) {
    	var each_1_anchor, current;

    	var each_value = ctx.pieces;

    	var each_blocks = [];

    	for (var i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	return {
    		c: function create() {
    			for (var i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},

    		m: function mount(target, anchor) {
    			for (var i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert(target, each_1_anchor, anchor);
    			current = true;
    		},

    		p: function update(changed, ctx) {
    			if (changed.id || changed.pieces) {
    				each_value = ctx.pieces;

    				for (var i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(changed, child_ctx);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				group_outros();
    				for (i = each_value.length; i < each_blocks.length; i += 1) out(i);
    				check_outros();
    			}
    		},

    		i: function intro(local) {
    			if (current) return;
    			for (var i = 0; i < each_value.length; i += 1) transition_in(each_blocks[i]);

    			current = true;
    		},

    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);
    			for (let i = 0; i < each_blocks.length; i += 1) transition_out(each_blocks[i]);

    			current = false;
    		},

    		d: function destroy(detaching) {
    			destroy_each(each_blocks, detaching);

    			if (detaching) {
    				detach(each_1_anchor);
    			}
    		}
    	};
    }

    // (34:4) {#each pieces as piece, index}
    function create_each_block(ctx) {
    	var current;

    	var piece = new Piece({
    		props: { id: `${ctx.id}-piece-${ctx.index}`, type: ctx.piece },
    		$$inline: true
    	});

    	return {
    		c: function create() {
    			piece.$$.fragment.c();
    		},

    		m: function mount(target, anchor) {
    			mount_component(piece, target, anchor);
    			current = true;
    		},

    		p: function update(changed, ctx) {
    			var piece_changes = {};
    			if (changed.id) piece_changes.id = `${ctx.id}-piece-${ctx.index}`;
    			if (changed.pieces) piece_changes.type = ctx.piece;
    			piece.$set(piece_changes);
    		},

    		i: function intro(local) {
    			if (current) return;
    			transition_in(piece.$$.fragment, local);

    			current = true;
    		},

    		o: function outro(local) {
    			transition_out(piece.$$.fragment, local);
    			current = false;
    		},

    		d: function destroy(detaching) {
    			destroy_component(piece, detaching);
    		}
    	};
    }

    function create_fragment$1(ctx) {
    	var div, div_class_value, current;

    	var if_block = (ctx.pieces.length) && create_if_block(ctx);

    	return {
    		c: function create() {
    			div = element("div");
    			if (if_block) if_block.c();
    			attr(div, "class", div_class_value = " tile " + (ctx.isRosette ? 'rosette' : '') + "\r\n  " + (ctx.accepts.length ? '' : 'empty') + "\r\n  " + " svelte-8g27aj");
    			add_location(div, file$1, 28, 0, 504);
    		},

    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},

    		m: function mount(target, anchor) {
    			insert(target, div, anchor);
    			if (if_block) if_block.m(div, null);
    			current = true;
    		},

    		p: function update(changed, ctx) {
    			if (ctx.pieces.length) {
    				if (if_block) {
    					if_block.p(changed, ctx);
    					transition_in(if_block, 1);
    				} else {
    					if_block = create_if_block(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(div, null);
    				}
    			} else if (if_block) {
    				group_outros();
    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});
    				check_outros();
    			}

    			if ((!current || changed.isRosette || changed.accepts) && div_class_value !== (div_class_value = " tile " + (ctx.isRosette ? 'rosette' : '') + "\r\n  " + (ctx.accepts.length ? '' : 'empty') + "\r\n  " + " svelte-8g27aj")) {
    				attr(div, "class", div_class_value);
    			}
    		},

    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},

    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach(div);
    			}

    			if (if_block) if_block.d();
    		}
    	};
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let { id, pieces, isRosette = false, accepts } = $$props;

    	const writable_props = ['id', 'pieces', 'isRosette', 'accepts'];
    	Object.keys($$props).forEach(key => {
    		if (!writable_props.includes(key) && !key.startsWith('$$')) console.warn(`<Tile> was created with unknown prop '${key}'`);
    	});

    	$$self.$set = $$props => {
    		if ('id' in $$props) $$invalidate('id', id = $$props.id);
    		if ('pieces' in $$props) $$invalidate('pieces', pieces = $$props.pieces);
    		if ('isRosette' in $$props) $$invalidate('isRosette', isRosette = $$props.isRosette);
    		if ('accepts' in $$props) $$invalidate('accepts', accepts = $$props.accepts);
    	};

    	return { id, pieces, isRosette, accepts };
    }

    class Tile extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, ["id", "pieces", "isRosette", "accepts"]);

    		const { ctx } = this.$$;
    		const props = options.props || {};
    		if (ctx.id === undefined && !('id' in props)) {
    			console.warn("<Tile> was created without expected prop 'id'");
    		}
    		if (ctx.pieces === undefined && !('pieces' in props)) {
    			console.warn("<Tile> was created without expected prop 'pieces'");
    		}
    		if (ctx.accepts === undefined && !('accepts' in props)) {
    			console.warn("<Tile> was created without expected prop 'accepts'");
    		}
    	}

    	get id() {
    		throw new Error("<Tile>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set id(value) {
    		throw new Error("<Tile>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get pieces() {
    		throw new Error("<Tile>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set pieces(value) {
    		throw new Error("<Tile>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get isRosette() {
    		throw new Error("<Tile>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isRosette(value) {
    		throw new Error("<Tile>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get accepts() {
    		throw new Error("<Tile>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set accepts(value) {
    		throw new Error("<Tile>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\components\Board.svelte generated by Svelte v3.6.8 */

    const file$2 = "src\\components\\Board.svelte";

    function get_each_context_1(ctx, list, i) {
    	const child_ctx = Object.create(ctx);
    	child_ctx.tile = list[i];
    	return child_ctx;
    }

    function get_each_context$1(ctx, list, i) {
    	const child_ctx = Object.create(ctx);
    	child_ctx.row = list[i];
    	return child_ctx;
    }

    // (15:6) {#each row as tile}
    function create_each_block_1(ctx) {
    	var current;

    	var tile_spread_levels = [
    		ctx.tile
    	];

    	let tile_props = {};
    	for (var i = 0; i < tile_spread_levels.length; i += 1) {
    		tile_props = assign(tile_props, tile_spread_levels[i]);
    	}
    	var tile = new Tile({ props: tile_props, $$inline: true });

    	return {
    		c: function create() {
    			tile.$$.fragment.c();
    		},

    		m: function mount(target, anchor) {
    			mount_component(tile, target, anchor);
    			current = true;
    		},

    		p: function update(changed, ctx) {
    			var tile_changes = changed.rowSet ? get_spread_update(tile_spread_levels, [
    				ctx.tile
    			]) : {};
    			tile.$set(tile_changes);
    		},

    		i: function intro(local) {
    			if (current) return;
    			transition_in(tile.$$.fragment, local);

    			current = true;
    		},

    		o: function outro(local) {
    			transition_out(tile.$$.fragment, local);
    			current = false;
    		},

    		d: function destroy(detaching) {
    			destroy_component(tile, detaching);
    		}
    	};
    }

    // (13:2) {#each rowSet as row}
    function create_each_block$1(ctx) {
    	var div, t, current;

    	var each_value_1 = ctx.row;

    	var each_blocks = [];

    	for (var i = 0; i < each_value_1.length; i += 1) {
    		each_blocks[i] = create_each_block_1(get_each_context_1(ctx, each_value_1, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	return {
    		c: function create() {
    			div = element("div");

    			for (var i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t = space();
    			attr(div, "class", "row svelte-24jk5j");
    			add_location(div, file$2, 13, 4, 213);
    		},

    		m: function mount(target, anchor) {
    			insert(target, div, anchor);

    			for (var i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div, null);
    			}

    			append(div, t);
    			current = true;
    		},

    		p: function update(changed, ctx) {
    			if (changed.rowSet) {
    				each_value_1 = ctx.row;

    				for (var i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1(ctx, each_value_1, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(changed, child_ctx);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block_1(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(div, t);
    					}
    				}

    				group_outros();
    				for (i = each_value_1.length; i < each_blocks.length; i += 1) out(i);
    				check_outros();
    			}
    		},

    		i: function intro(local) {
    			if (current) return;
    			for (var i = 0; i < each_value_1.length; i += 1) transition_in(each_blocks[i]);

    			current = true;
    		},

    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);
    			for (let i = 0; i < each_blocks.length; i += 1) transition_out(each_blocks[i]);

    			current = false;
    		},

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach(div);
    			}

    			destroy_each(each_blocks, detaching);
    		}
    	};
    }

    function create_fragment$2(ctx) {
    	var div, current;

    	var each_value = ctx.rowSet;

    	var each_blocks = [];

    	for (var i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$1(get_each_context$1(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	return {
    		c: function create() {
    			div = element("div");

    			for (var i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}
    			attr(div, "class", "board");
    			add_location(div, file$2, 11, 0, 163);
    		},

    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},

    		m: function mount(target, anchor) {
    			insert(target, div, anchor);

    			for (var i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div, null);
    			}

    			current = true;
    		},

    		p: function update(changed, ctx) {
    			if (changed.rowSet) {
    				each_value = ctx.rowSet;

    				for (var i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$1(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(changed, child_ctx);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$1(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(div, null);
    					}
    				}

    				group_outros();
    				for (i = each_value.length; i < each_blocks.length; i += 1) out(i);
    				check_outros();
    			}
    		},

    		i: function intro(local) {
    			if (current) return;
    			for (var i = 0; i < each_value.length; i += 1) transition_in(each_blocks[i]);

    			current = true;
    		},

    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);
    			for (let i = 0; i < each_blocks.length; i += 1) transition_out(each_blocks[i]);

    			current = false;
    		},

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach(div);
    			}

    			destroy_each(each_blocks, detaching);
    		}
    	};
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let { rowSet } = $$props; // two dimensional array

    	const writable_props = ['rowSet'];
    	Object.keys($$props).forEach(key => {
    		if (!writable_props.includes(key) && !key.startsWith('$$')) console.warn(`<Board> was created with unknown prop '${key}'`);
    	});

    	$$self.$set = $$props => {
    		if ('rowSet' in $$props) $$invalidate('rowSet', rowSet = $$props.rowSet);
    	};

    	return { rowSet };
    }

    class Board extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, ["rowSet"]);

    		const { ctx } = this.$$;
    		const props = options.props || {};
    		if (ctx.rowSet === undefined && !('rowSet' in props)) {
    			console.warn("<Board> was created without expected prop 'rowSet'");
    		}
    	}

    	get rowSet() {
    		throw new Error("<Board>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set rowSet(value) {
    		throw new Error("<Board>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\components\PieceBucket.svelte generated by Svelte v3.6.8 */

    const file$3 = "src\\components\\PieceBucket.svelte";

    function get_each_context$2(ctx, list, i) {
    	const child_ctx = Object.create(ctx);
    	child_ctx.piece = list[i];
    	return child_ctx;
    }

    // (14:2) {#each Array(pieces) as piece}
    function create_each_block$2(ctx) {
    	var current;

    	var piece = new Piece({
    		props: { type: ctx.type },
    		$$inline: true
    	});

    	return {
    		c: function create() {
    			piece.$$.fragment.c();
    		},

    		m: function mount(target, anchor) {
    			mount_component(piece, target, anchor);
    			current = true;
    		},

    		p: function update(changed, ctx) {
    			var piece_changes = {};
    			if (changed.type) piece_changes.type = ctx.type;
    			piece.$set(piece_changes);
    		},

    		i: function intro(local) {
    			if (current) return;
    			transition_in(piece.$$.fragment, local);

    			current = true;
    		},

    		o: function outro(local) {
    			transition_out(piece.$$.fragment, local);
    			current = false;
    		},

    		d: function destroy(detaching) {
    			destroy_component(piece, detaching);
    		}
    	};
    }

    function create_fragment$3(ctx) {
    	var div, current;

    	var each_value = Array(ctx.pieces);

    	var each_blocks = [];

    	for (var i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$2(get_each_context$2(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	return {
    		c: function create() {
    			div = element("div");

    			for (var i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}
    			attr(div, "class", "bucket svelte-1ktua5");
    			add_location(div, file$3, 12, 0, 182);
    		},

    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},

    		m: function mount(target, anchor) {
    			insert(target, div, anchor);

    			for (var i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div, null);
    			}

    			current = true;
    		},

    		p: function update(changed, ctx) {
    			if (changed.type || changed.pieces) {
    				each_value = Array(ctx.pieces);

    				for (var i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$2(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(changed, child_ctx);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$2(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(div, null);
    					}
    				}

    				group_outros();
    				for (i = each_value.length; i < each_blocks.length; i += 1) out(i);
    				check_outros();
    			}
    		},

    		i: function intro(local) {
    			if (current) return;
    			for (var i = 0; i < each_value.length; i += 1) transition_in(each_blocks[i]);

    			current = true;
    		},

    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);
    			for (let i = 0; i < each_blocks.length; i += 1) transition_out(each_blocks[i]);

    			current = false;
    		},

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach(div);
    			}

    			destroy_each(each_blocks, detaching);
    		}
    	};
    }

    function instance$3($$self, $$props, $$invalidate) {
    	let { pieces, type } = $$props; //string

    	const writable_props = ['pieces', 'type'];
    	Object.keys($$props).forEach(key => {
    		if (!writable_props.includes(key) && !key.startsWith('$$')) console.warn(`<PieceBucket> was created with unknown prop '${key}'`);
    	});

    	$$self.$set = $$props => {
    		if ('pieces' in $$props) $$invalidate('pieces', pieces = $$props.pieces);
    		if ('type' in $$props) $$invalidate('type', type = $$props.type);
    	};

    	return { pieces, type };
    }

    class PieceBucket extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, ["pieces", "type"]);

    		const { ctx } = this.$$;
    		const props = options.props || {};
    		if (ctx.pieces === undefined && !('pieces' in props)) {
    			console.warn("<PieceBucket> was created without expected prop 'pieces'");
    		}
    		if (ctx.type === undefined && !('type' in props)) {
    			console.warn("<PieceBucket> was created without expected prop 'type'");
    		}
    	}

    	get pieces() {
    		throw new Error("<PieceBucket>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set pieces(value) {
    		throw new Error("<PieceBucket>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get type() {
    		throw new Error("<PieceBucket>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set type(value) {
    		throw new Error("<PieceBucket>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\components\DiceBox.svelte generated by Svelte v3.6.8 */

    const file$4 = "src\\components\\DiceBox.svelte";

    function create_fragment$4(ctx) {
    	var div, span0, t0, t1_value = ctx.dices.length, t1, t2, t3, span1, t4, t5, t6, button, dispose;

    	return {
    		c: function create() {
    			div = element("div");
    			span0 = element("span");
    			t0 = text("There are ");
    			t1 = text(t1_value);
    			t2 = text(" dices in the box");
    			t3 = space();
    			span1 = element("span");
    			t4 = text("Dice Throw result = ");
    			t5 = text(ctx.result);
    			t6 = space();
    			button = element("button");
    			button.textContent = "roll";
    			add_location(span0, file$4, 14, 2, 294);
    			add_location(span1, file$4, 16, 2, 354);
    			add_location(button, file$4, 18, 2, 401);
    			add_location(div, file$4, 13, 0, 285);
    			dispose = listen(button, "click", ctx.handleDiceThrow);
    		},

    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},

    		m: function mount(target, anchor) {
    			insert(target, div, anchor);
    			append(div, span0);
    			append(span0, t0);
    			append(span0, t1);
    			append(span0, t2);
    			append(div, t3);
    			append(div, span1);
    			append(span1, t4);
    			append(span1, t5);
    			append(div, t6);
    			append(div, button);
    		},

    		p: function update(changed, ctx) {
    			if ((changed.dices) && t1_value !== (t1_value = ctx.dices.length)) {
    				set_data(t1, t1_value);
    			}

    			if (changed.result) {
    				set_data(t5, ctx.result);
    			}
    		},

    		i: noop,
    		o: noop,

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach(div);
    			}

    			dispose();
    		}
    	};
    }

    function instance$4($$self, $$props, $$invalidate) {
    	let { dices } = $$props;
      let result = 0;

      const throwDices = diceSet => {
        $$invalidate('result', result = diceSet.reduce((acc, dice) => {
          return acc + dice[Math.floor(Math.random() * dice.length)];
        }, 0));
      };

      const handleDiceThrow = () => throwDices(dices);

    	const writable_props = ['dices'];
    	Object.keys($$props).forEach(key => {
    		if (!writable_props.includes(key) && !key.startsWith('$$')) console.warn(`<DiceBox> was created with unknown prop '${key}'`);
    	});

    	$$self.$set = $$props => {
    		if ('dices' in $$props) $$invalidate('dices', dices = $$props.dices);
    	};

    	return { dices, result, handleDiceThrow };
    }

    class DiceBox extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, ["dices"]);

    		const { ctx } = this.$$;
    		const props = options.props || {};
    		if (ctx.dices === undefined && !('dices' in props)) {
    			console.warn("<DiceBox> was created without expected prop 'dices'");
    		}
    	}

    	get dices() {
    		throw new Error("<DiceBox>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set dices(value) {
    		throw new Error("<DiceBox>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\App.svelte generated by Svelte v3.6.8 */

    const file$5 = "src\\App.svelte";

    function create_fragment$5(ctx) {
    	var div, h3, t0, t1_value =  'white' , t1, t2, t3, br, t4, t5, t6, current;

    	var board = new Board({
    		props: { boardState: boardState },
    		$$inline: true
    	});

    	var piecebucket0 = new PieceBucket({
    		props: { pieces: 7, type: ctx.pieceType[1] },
    		$$inline: true
    	});

    	var piecebucket1 = new PieceBucket({
    		props: { pieces: 7, type: ctx.pieceType[2] },
    		$$inline: true
    	});

    	var dicebox = new DiceBox({
    		props: { dices: ctx.dices },
    		$$inline: true
    	});

    	return {
    		c: function create() {
    			div = element("div");
    			h3 = element("h3");
    			t0 = text("Now moves ");
    			t1 = text(t1_value);
    			t2 = space();
    			board.$$.fragment.c();
    			t3 = space();
    			br = element("br");
    			t4 = space();
    			piecebucket0.$$.fragment.c();
    			t5 = space();
    			piecebucket1.$$.fragment.c();
    			t6 = space();
    			dicebox.$$.fragment.c();
    			add_location(h3, file$5, 27, 2, 783);
    			add_location(br, file$5, 29, 2, 862);
    			attr(div, "class", "wrapper");
    			add_location(div, file$5, 26, 0, 759);
    		},

    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},

    		m: function mount(target, anchor) {
    			insert(target, div, anchor);
    			append(div, h3);
    			append(h3, t0);
    			append(h3, t1);
    			append(div, t2);
    			mount_component(board, div, null);
    			append(div, t3);
    			append(div, br);
    			append(div, t4);
    			mount_component(piecebucket0, div, null);
    			append(div, t5);
    			mount_component(piecebucket1, div, null);
    			append(div, t6);
    			mount_component(dicebox, div, null);
    			current = true;
    		},

    		p: function update(changed, ctx) {
    			var board_changes = {};
    			if (changed.boardState) board_changes.boardState = boardState;
    			board.$set(board_changes);

    			var piecebucket0_changes = {};
    			if (changed.pieceType) piecebucket0_changes.type = ctx.pieceType[1];
    			piecebucket0.$set(piecebucket0_changes);

    			var piecebucket1_changes = {};
    			if (changed.pieceType) piecebucket1_changes.type = ctx.pieceType[2];
    			piecebucket1.$set(piecebucket1_changes);

    			var dicebox_changes = {};
    			if (changed.dices) dicebox_changes.dices = ctx.dices;
    			dicebox.$set(dicebox_changes);
    		},

    		i: function intro(local) {
    			if (current) return;
    			transition_in(board.$$.fragment, local);

    			transition_in(piecebucket0.$$.fragment, local);

    			transition_in(piecebucket1.$$.fragment, local);

    			transition_in(dicebox.$$.fragment, local);

    			current = true;
    		},

    		o: function outro(local) {
    			transition_out(board.$$.fragment, local);
    			transition_out(piecebucket0.$$.fragment, local);
    			transition_out(piecebucket1.$$.fragment, local);
    			transition_out(dicebox.$$.fragment, local);
    			current = false;
    		},

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach(div);
    			}

    			destroy_component(board);

    			destroy_component(piecebucket0);

    			destroy_component(piecebucket1);

    			destroy_component(dicebox);
    		}
    	};
    }

    function instance$5($$self) {

      // Dice is an array with sides and values
      const dice = [0, 0, 1, 1];
      const dices = [dice, dice, dice, dice];

      const pieceType = {
        1: "black",
        2: "white"
      };

    	return { dices, pieceType };
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$5, create_fragment$5, safe_not_equal, []);
    	}
    }

    const app = new App({
    	target: document.body
    });

    return app;

}());
//# sourceMappingURL=bundle.js.map
