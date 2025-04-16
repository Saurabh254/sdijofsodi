import Webcam from "react-webcam";

const WebCamPreviewComp = () => {
  return (
    <div className="absolute top-0 right-0 w-[400px] mt-24 border-2 border-slate-300 mr-4 rounded-xl bg-slate-200 overflow-hidden">
      <Webcam />
      <span className="text-red-700 text-center w-full block my-2">
        You're being monitored
      </span>
    </div>
  );
};

export default WebCamPreviewComp;
