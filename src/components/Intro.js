import React from "react";

export default function Intro() {
  return (
    <div style={{ marginTop: 20, textAlign: "justify" }}>
      <p>
        Welcome to this survey for rating responses generated from a dialogue
        model. Empathy is a crucial component in any social interaction and
        improving currently available state-of-the-art dialogue models with
        empathy and emotional knowledge is key for building well-rounded virtual
        assistants and therapists. However, this is a non-trivial task due to
        the core empathetic interactions that a system must understand and
        replicate. Moreover, most automated metrics in natural language
        processing fail to capture the quality of an empathetic dialogue model,
        therefore, human evaluation is invaluable at this stage!
      </p>
      <p>
        To contribute to research in this field, we request you to take this
        survey in order to generate some human evaluation metrics that will help
        us judge the performance of our trained models, critique what
        architectures and techniques are best, and achieve further improvement.
        For the purpose of this survey, each sample would consist of a dialogue
        history in a speaker-listener conversational format. Given this history,
        you will be prompted to compare two listener responses and rate them on
        the following criteria:
      </p>
      <ul style={{ marginTop: 20 }}>
        <li>
          <span style={{ fontWeight: "bold" }}>Empathy</span> - How well the
          model recognises the emotional state of the speaker and responds in
          accordance to that emotional state.
        </li>
        <li>
          <span style={{ fontWeight: "bold" }}>Relevance</span> - How relevant
          and logical the response is with respect to the dialogue history.
        </li>
        <li>
          <span style={{ fontWeight: "bold" }}>Fluency</span> - How fluent the
          model is in terms of it's language and what it is trying to convey.
        </li>
      </ul>
      <p style={{ fontStyle: "italic", marginTop: 50 }}>
        <span style={{ fontWeight: "bold" }}>DISCLAIMER:</span> Although
        generally most dialogue histories and responses are moderately intense,
        some participants might find the content disturbing, negative, or
        disconcerting because of their mixed grounding in both negative and
        positive emotional situations so please feel free to opt out at any
        stage.
      </p>
    </div>
  );
}
