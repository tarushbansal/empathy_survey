import React from "react";

export default function Intro() {
  return (
    <div style={{ marginTop: 20, textAlign: "justify" }}>
      <p>
        Welcome to this survey for rating responses generated from automated
        dialogue models. Empathy is a crucial component in any social
        interaction and improving currently available state-of-the-art dialogue
        models with empathy and emotional knowledge is key for building
        well-rounded virtual assistants and therapists. However, this is a
        non-trivial task due to the core empathetic interactions that a system
        must understand and replicate. Moreover, most automated metrics in
        natural language processing fail to capture the quality of an empathetic
        dialogue model, therefore, human evaluation is invaluable at this stage!
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
          response recognises the emotional state of the speaker and tries to
          exhibit appropriate emotions in accordance to that state.
        </li>
        <li>
          <span style={{ fontWeight: "bold" }}>Relevance</span> - How logical
          and on-topic the response is with respect to the dialogue history.
        </li>
        <li>
          <span style={{ fontWeight: "bold" }}>Fluency</span> - How gramatically
          correct and readible the response is i.e., how clear it is in what it
          is trying to convey.
        </li>
      </ul>
      <p>
        For example, given a speaker input{" "}
        <span style={{ fontStyle: "italic" }}>
          "I got rejected at the job interview I gave yesterday."
        </span>
        , a listener response like{" "}
        <span style={{ fontStyle: "italic" }}>
          "What sort of jobs are you looking for?"{" "}
        </span>
        would score high in Relevance since it is topically coherent but low in
        Empathy since the underlying emotion of disappointment has been missed.
        Another example response to the same input could be{" "}
        <span style={{ fontStyle: "italic" }}>"I hope you get the job!" </span>{" "}
        which is relatively higher in Empathy since it recognises the speaker's
        desire to get a job and expresses supportive emotions but is low in
        Relevance since the context already indicates that the speaker didn't
        get the job. Empathy and Relevance are slightly correlated metrics since
        a response needs to be relevant in order to get very high scores in
        Empathy but feel free to use your best judgement in ambiguous cases.
      </p>
      <p style={{ fontStyle: "italic", marginTop: 50 }}>
        <span style={{ fontWeight: "bold" }}>DISCLAIMER:</span> Although
        generally most dialogue histories and responses are moderately intense,
        some participants might find the content disturbing or disconcerting
        because of their mixed grounding in both negative and positive emotional
        situations, so please feel free to opt out at any stage.
      </p>
    </div>
  );
}
