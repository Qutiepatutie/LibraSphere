import WebcamCapture from "./WebcamCapture.jsx"
import jsQR from "jsqr"

export default function QRScanner({ setData, className }) {

     const handleScan = (imageSrc) => {
          if (imageSrc) {
               const image = new Image();
               image.src = imageSrc;
               image.onload = () => {
                    const canvas = document.createElement("canvas");
                    canvas.width = image.width;
                    canvas.height = image.height;
                    const ctx = canvas.getContext("2d");
                    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
                    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                    const code = jsQR(imageData.data, imageData.width, imageData.height, { inversionAttempts: "dontInvert" });

                    if (code) {
                         setData(code.data);
                         console.log("code: ", code.data);
                    }
               }
          }

     }
     return (
          <div>
               <WebcamCapture onScan={handleScan} className={className} />
          </div>
     )
}