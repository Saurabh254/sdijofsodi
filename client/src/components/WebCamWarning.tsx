import { RiCloseLine, RiCrossLine } from "@remixicon/react";

const WebcamWarning: React.FC = () => {
  return (
    <div
      style={{
        padding: "20px",
        backgroundColor: "#fff3cd",
        border: "1px solid #ffeeba",
        borderRadius: "5px",
        color: "#856404",
        fontSize: "16px",
        lineHeight: "1.5",
      }}
      id="webcam-warning"
      className="mb-4 relative"
    >
      <RiCloseLine
        className="absolute right-0 top-0 m-2 cursor-pointer"
        onClick={() =>
          document.getElementById("webcam-warning")?.toggleAttribute("hidden")
        }
      />
      <strong>Important Notice!</strong> To appear for this exam, it is
      mandatory to have both your webcam and microphone turned{" "}
      <strong>ON</strong> throughout the entire test. You will be monitored and
      recorded for the duration of the exam to ensure fairness and prevent any
      malpractice. Please ensure your devices are properly connected before
      starting the exam. Failure to comply may lead to disqualification.
    </div>
  );
};

export default WebcamWarning;
