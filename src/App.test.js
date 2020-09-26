import React from "react";
import { configure, mount, shallow } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import App, { Todo, TodoForm, useTodos } from "./App";

configure({ adapter: new Adapter() });

describe("App", () => {
  describe("Unit - Todo", () => {
    it("execute completeTodo when completed clicked", () => {
      const completeTodo = jest.fn();
      const removeTodo = jest.fn();
      const index = 6;
      const todo = {
        isCompleted: true,
        text: "Nemo",
      };
      const wrapper = shallow(
        <Todo
          todo={todo}
          index={index}
          completeTodo={completeTodo}
          removeTodo={removeTodo}
        />
      );
      wrapper.find("button").at(0).simulate("click");
      expect(completeTodo.mock.calls).toEqual([[index]]);
      expect(removeTodo.mock.calls).toEqual([]);
    });

    it("execute removeTodo when X clicked", () => {
      const completeTodo = jest.fn();
      const removeTodo = jest.fn();
      const index = 6;
      const todo = {
        isCompleted: true,
        text: "Nemo",
      };
      const wrapper = shallow(
        <Todo
          todo={todo}
          index={index}
          completeTodo={completeTodo}
          removeTodo={removeTodo}
        />
      );
      wrapper.find("button").at(1).simulate("click");
      expect(removeTodo.mock.calls).toEqual([[index]]);
      expect(completeTodo.mock.calls).toEqual([]);
    });
  });

  describe("Unit - TodoForm", () => {
    it("call addTodo when form has a value", () => {
      const addTodo = jest.fn();
      const preventDefault = jest.fn();
      const wrapper = shallow(<TodoForm addTodo={addTodo} />);
      wrapper
        .find("input")
        .simulate("change", { target: { value: "new todo" } });
      wrapper.find("form").simulate("submit", { preventDefault });
      expect(addTodo.mock.calls).toEqual([["new todo"]]);
      expect(preventDefault.mock.calls).toEqual([[]]);
    });
  });

  describe("Custom hook: useTodos", () => {
    it("addTodo", () => {
      const Test = (props) => {
        const hook = props.hook();
        return <div {...hook} />;
      };
      const task = "task custom todo";
      const wrapper = shallow(<Test hook={useTodos} />);
      let props = wrapper.find("div").props();
      props.addTodo(task);
      props = wrapper.find("div").props();
      expect(props.todos[0]).toEqual({ text: task });
      expect(props.todos.length).toEqual(4);
    });

    it("removeTodo", () => {
      const Test = (props) => {
        const hook = props.hook();
        return <div {...hook} />;
      };
      const index = 2;
      const wrapper = shallow(<Test hook={useTodos} />);
      let props = wrapper.find("div").props();
      props.removeTodo(index);
      props = wrapper.find("div").props();
      expect(props.todos).toEqual([
        {
          text: "Todo 1",
          isCompleted: false,
        },
        {
          text: "Todo 2",
          isCompleted: false,
        },
      ]);
      expect(props.todos.length).toEqual(2);
    });

    it("completeTodo", () => {
      const Test = (props) => {
        const hook = props.hook();
        return <div {...hook} />;
      };
      const index = 2;
      const task = "Todo 3";
      const wrapper = shallow(<Test hook={useTodos} />);
      let props = wrapper.find("div").props();
      props.completeTodo(index);
      props = wrapper.find("div").props();
      expect(props.todos[2]).toEqual({ text: task, isCompleted: true });
      expect(props.todos.length).toEqual(3);
    });
  });

  describe("Integration - App", () => {
    it("App", () => {
      const wrapper = mount(<App />);
      const preventDefault = jest.fn();
      const task = "New Task!";

      wrapper.find("input").simulate("change", { target: { value: task } });
      expect(preventDefault.mock.calls).toEqual([]);
      wrapper.find("form").simulate("submit", { preventDefault });
      expect(preventDefault.mock.calls).toEqual([[]]);
      const response = wrapper.find(".todo").at(0).text().includes(task);
      expect(response).toEqual(true);
    });
  });
});
