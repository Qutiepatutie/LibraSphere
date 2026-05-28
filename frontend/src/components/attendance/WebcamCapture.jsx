import { useRef, useEffect } from "react";
import Webcam from "react-webcam"

export default function WebcamCapture({ onScan, className }) {
     const webcamRef = useRef(null);

     const capture = () => {
          const imageSrc = webcamRef.current.getScreenshot();
          onScan(imageSrc);
     }
          
     useEffect(() => {
          const timer = setInterval(() => {
               capture();
          }, 100);
          return () => clearInterval(timer);
     })
     
     return (
          <div>
               <Webcam
                    className={className}
                    audio={false}
                    ref={webcamRef}
                    screenshotFormat="image/jpeg"
                    videoConstraints={{ facingMode: "environment" }}
                    onClick={() => capture()}
               />
                    
          </div>
     )
}
