import React, { Component } from "react";
import Intro from "../components/Intro";
import Scale from "../components/Scale";
import { Amplify, API } from "aws-amplify";
import config from "../aws-exports";
import { useNavigate } from "react-router-dom";

Amplify.configure(config);

export default function SurveyWrapper(props) {
  const navigate = useNavigate();
  return <Survey navigate={navigate} {...props} />;
}

class Survey extends Component {
  constructor(props) {
    super(props);
    this.state = { noSamples: false, getErrorMessage: "", samples: [] };
    API.get("surveyapi", "/samples/10")
      .then((res) => {
        let newState = { noSamples: false, samples: res };
        if (res.length === 0) {
          newState.noSamples = true;
        }
        this.setState(newState, () => {
          this.ratings = this.state.samples.map((sample) => ({
            id: sample.id,
            ratings: [0, 0, 0],
          }));
        });
      })
      .catch((err) => {
        this.setState({
          getErrorMessage:
            "Oops! An error has occured while fetching the survey samples. Please try again later.",
        });
        console.error(err.response.data);
      });
  }

  onChange(sampleId, ratingIdx, val) {
    for (let i = 0; i < this.ratings.length; i++) {
      if (this.ratings[i].id === sampleId) {
        this.ratings[i].ratings[ratingIdx] = val;
        break;
      }
    }
  }

  submitResponses() {
    if (this.ratings && this.ratings.length !== 0) {
      API.post("surveyapi", "/samples/ratings", { body: this.ratings })
        .then(() =>
          this.props.navigate("/submit", { state: { status: "SUCCESS" } })
        )
        .catch((err) => {
          console.log(err.response.data);
          this.props.navigate("/submit", { state: { status: "ERROR" } });
        });
    }
  }

  render() {
    return (
      <div>
        {this.state.noSamples ? (
          <div style={{ marginTop: 20, color: "red" }}>
            NO SAMPLES CURRENTLY LEFT TO SURVEY. PLEASE COME BACK LATER {":))"}
          </div>
        ) : (
          <div></div>
        )}
        <div style={{ marginTop: 20, color: "red" }}>
          {this.state.getErrorMessage}
        </div>
        <Intro />
        {this.state.samples.map((item, idx) => (
          <div key={idx} style={{ marginTop: 50 }}>
            <p>
              <strong style={{ textDecoration: "underline" }}>
                SAMPLE {idx + 1}
              </strong>
              <br />
            </p>
            <p>
              {item.sample.context.map((utt, idx) => (
                <span key={idx}>
                  <strong>{idx % 2 === 0 ? "Speaker: " : "Listener: "}</strong>
                  {utt} <br />
                </span>
              ))}
            </p>
            <p>
              <strong>Response A: </strong>
              {item.sample.responseA} <br />
              <strong>Response B: </strong>
              {item.sample.responseB}
            </p>
            <div style={{ marginTop: 40 }}>
              <strong>Which response is better in terms of Empathy?</strong>
              <Scale
                id={item.id + "0"}
                onChange={(val) => this.onChange(item.id, 0, val)}
              />
            </div>
            <div style={{ marginTop: 40 }}>
              <strong>Which response is better in terms of Relevance?</strong>
              <Scale
                id={item.id + "1"}
                onChange={(val) => this.onChange(item.id, 1, val)}
              />
            </div>
            <div style={{ marginTop: 40 }}>
              <strong>Which response is better in terms of Fluency?</strong>
              <Scale
                id={item.id + "2"}
                onChange={(val) => this.onChange(item.id, 2, val)}
              />
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
      </div>
    );
  }
}
