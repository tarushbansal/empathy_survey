import { Component } from "react";
import Likert from "react-likert-scale";

export default class Scale extends Component {
  constructor(props) {
    super(props);
    this.likertOptions = {
      id: props.id,
      responses: [
        { value: -2, text: "Strongly A" },
        { value: -1, text: "A" },
        { value: 0, text: "Neutral", checked: true },
        { value: 1, text: "B" },
        { value: 2, text: "Strongly B" },
      ],
      onChange: (selection) => props.onChange(selection.value),
    };
  }

  render() {
    return <Likert {...this.likertOptions} />;
  }
}
