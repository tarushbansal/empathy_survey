import React, { Component } from "react";
import MyNavbar from "../components/MyNavbar";
import Intro from "../components/Intro";
import Container from "react-bootstrap/Container";
import Scale from "../components/Scale";

export default class Survey extends Component {
  constructor(props) {
    super(props);
    // Fetch survey samples from API here and assign default ratings for each sampleid
    this.samples = {
      0: {
        context: ["hi", "hey", "how are you"],
        resA: "good",
        resB: "nice",
      },
      1: {
        context: ["hi", "hey", "how are you"],
        resA: "good",
        resB: "nice",
      },
    };
    this.ratings = {
      0: [0, 0, 0],
      1: [0, 0, 0],
    };
  }

  submitResponses() {
    // Post survey responses to API here
  }

  render() {
    return (
      <Container>
        <MyNavbar />
        <Intro />
        {Object.keys(this.samples).map((id, sampleNum) => (
          <div key={id} style={{ marginTop: 50 }}>
            <p>
              <strong style={{ textDecoration: "underline" }}>
                SAMPLE {sampleNum + 1}
              </strong>
              <br />
            </p>
            <p>
              {this.samples[id].context.map((utt, idx) => (
                <span key={idx}>
                  <strong>{idx % 2 === 0 ? "Speaker: " : "Listener: "}</strong>
                  {utt} <br />
                </span>
              ))}
            </p>
            <p>
              <strong>Response A: </strong>
              {this.samples[id].resA} <br />
              <strong>Response B: </strong>
              {this.samples[id].resB}
            </p>
            <div style={{ marginTop: 40 }}>
              <strong>Which response is better in terms of Empathy?</strong>
              <Scale onChange={(val) => (this.ratings[id][0] = val)} />
            </div>
            <div style={{ marginTop: 40 }}>
              <strong>Which response is better in terms of Relevance?</strong>
              <Scale onChange={(val) => (this.ratings[id][1] = val)} />
            </div>
            <div style={{ marginTop: 40 }}>
              <strong>Which response is better in terms of Fluency?</strong>
              <Scale onChange={(val) => (this.ratings[id][2] = val)} />
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
