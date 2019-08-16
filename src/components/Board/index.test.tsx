import React from "react";
import { shallow } from "enzyme";
// mocks
import { mockRowSet } from "./../../../__mocks__/configMocks";
// components
import Board from "./";

describe("Board component ...", () => {
  it("... renders without crashing", () => {
    const wrapper = shallow(<Board />);
    expect(wrapper).toBeTruthy();
  });

  it("... matches snapshot", () => {
    const wrapper = shallow(<Board />);
    expect(wrapper).toMatchSnapshot();
  });

  it("... renders tiles according to config", () => {
    const wrapper = shallow(<Board tileSet={mockRowSet} />);

    expect(wrapper.find(".row")).toHaveLength(1);
    expect(wrapper.find(".tile")).toHaveLength(1);
  });
});
