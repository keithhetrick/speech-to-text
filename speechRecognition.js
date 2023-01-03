if ("webkitSpeechRecognition" in window) {
  // Initialize webkitSpeechRecognition
  let speechRecognition = new webkitSpeechRecognition();

  // String for the Final Transcript
  let final_transcript = "";

  // Set the properties for the Speech Recognition object
  speechRecognition.continuous = true;
  speechRecognition.interimResults = true;

  // Callback Function for the onStart Event & Clear Button functionality
  speechRecognition.onstart = () => {
    // Show the Status Element
    document.querySelector("#status").style.display = "block";
  };
  speechRecognition.onerror = () => {
    // Hide the Status Element
    document.querySelector("#status").style.display = "none";
  };
  speechRecognition.onend = () => {
    // Hide the Status Element, Show the Clear Button & Print Button
    document.querySelector("#status").style.display = "none";
    document.querySelector("#clear").style.display = "block";
    document.querySelector("#print").style.display = "block";

    // Clear Button
    document.querySelector("#clear").onclick = () => {
      // Clear the final transcript
      document.querySelector("#final").innerHTML = "";
      document.querySelector("#interim").innerHTML = "";

      // once transcript is cleared, clear & print button should be hidden
      document.querySelector("#clear").style.display = "none";
      document.querySelector("#print").style.display = "none";
    };
  };

  speechRecognition.onresult = (event) => {
    // Create the interim transcript string locally because we don't want it to persist like final transcript
    let interim_transcript = "";

    // Loop through the results from the speech recognition object.
    for (let i = event.resultIndex; i < event.results.length; ++i) {
      // If the result item is Final, add it to Final Transcript, Else add it to Interim transcript
      if (event.results[i].isFinal) {
        final_transcript += event.results[i][0].transcript;
      } else {
        interim_transcript += event.results[i][0].transcript;
      }
    }

    // Set the Final transcript and Interim transcript.
    document.querySelector("#final").innerHTML = final_transcript;
    document.querySelector("#interim").innerHTML = interim_transcript;
  };

  // Set the onClick property of the start button
  document.querySelector("#start").onclick = () => {
    // Start the Speech Recognition
    speechRecognition.start();
  };
  // Set the onClick property of the stop button
  document.querySelector("#stop").onclick = () => {
    // Stop the Speech Recognition
    speechRecognition.stop();
  };

  // print transcript
  document.querySelector("#print").onclick = () => {
    // Print the final transcript
    if (final_transcript) {
      console.log(final_transcript);

      // let file_Name be the longest word in the transcript
      let text = document.querySelector("#final").innerHTML;
      let textArray = text.split(" ");
      let file_Name = textArray.reduce((a, b) => (a.length > b.length ? a : b));
      download(file_Name, text);

      // send an alert to user that download is being initiated
      alert(
        `Download initiated for ${file_Name}, this may take a few seconds.`
      );

      // add download functionality in else statement
      function download(file_Name, text) {
        let element = document.createElement("a");
        element.setAttribute(
          "href",
          "data:text/plain;charset=utf-8," + encodeURIComponent(text)
        );
        element.setAttribute("download", file_Name);
        element.style.display = "none";
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
      }
    }
  };
} else {
  console.log("Speech Recognition Not Available");
}
