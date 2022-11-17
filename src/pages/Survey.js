import React, { Component } from "react";
import MyNavbar from "../components/MyNavbar";
import Intro from "../components/Intro";
import Container from "react-bootstrap/Container";
import Scale from "../components/Scale";
import { Amplify, API } from "aws-amplify";
import config from "../aws-exports";

Amplify.configure(config);

export default class Survey extends Component {
  constructor(props) {
    super(props);
    this.samples = API.get("surveyapi", "/samples").then(() => {
      this.ratings = this.samples.map((sample) => ({
        id: sample.id,
        ratings: [0, 0, 0],
      }));
    });
  }

  submitResponses() {
    API.post("surveyapi", "/surveyratings", { body: this.ratings });
  }

  render() {
    return (
      <Container>
        <MyNavbar />
        <Intro />
        {Object.keys(this.samples).map((sample, idx) => (
          <div key={idx} style={{ marginTop: 50 }}>
            <p>
              <strong style={{ textDecoration: "underline" }}>
                SAMPLE {idx + 1}
              </strong>
              <br />
            </p>
            <p>
              {sample.context.map((utt, idx) => (
                <span key={idx}>
                  <strong>{idx % 2 === 0 ? "Speaker: " : "Listener: "}</strong>
                  {utt} <br />
                </span>
              ))}
            </p>
            <p>
              <strong>Response A: </strong>
              {sample.responseA} <br />
              <strong>Response B: </strong>
              {sample.responseB}
            </p>
            <div style={{ marginTop: 40 }}>
              <strong>Which response is better in terms of Empathy?</strong>
              <Scale onChange={(val) => (this.ratings[sample.id][0] = val)} />
            </div>
            <div style={{ marginTop: 40 }}>
              <strong>Which response is better in terms of Relevance?</strong>
              <Scale onChange={(val) => (this.ratings[sample.id][1] = val)} />
            </div>
            <div style={{ marginTop: 40 }}>
              <strong>Which response is better in terms of Fluency?</strong>
              <Scale onChange={(val) => (this.ratings[sample.id][2] = val)} />
            </div>
          </div>
        ))}
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginTop: 100,
            marginBottom: 50,
          }}
        >
          <button
            type="button"
            className="btn btn-dark"
            onClick={this.submitResponses.bind(this)}
          >
            Submit Responses
          </button>
        </div>
      </Container>
    );
  }
}
