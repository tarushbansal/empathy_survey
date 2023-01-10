import { Component } from "react";
import Likert from "react-likert-scale";

export default class Scale extends Component {
  constructor(props) {
    super(props);
    this.likertOptions = {
      id: props.id,
      responses: [
        { value: -2, text: "Strongly Response A" },
        { value: -1, text: "Response A" },
        { value: 0, text: "No preference", checked: true },
        { value: 1, text: "Response B" },
        { value: 2, text: "Strongly Response B" },
      ],
      onChange: (selection) => props.onChange(selection.value),
    };
  }

  render() {
    return <Likert {...this.likertOptions} />;
  }
}
