import os
import io
import logging
from PIL import Image
from flask import Flask, render_template, request, send_from_directory, Response
from werkzeug.utils import secure_filename
import cv2
from ultralytics import YOLO

# Initialize Flask app
app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = 'uploads'
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

# Set up logging
logging.basicConfig(level=logging.DEBUG)

@app.route("/", methods=['GET', 'POST'])
def index():
    if request.method == 'POST':
        if 'file' not in request.files:
            logging.warning("No file part in the request")
            return "No file part in the request", 400

        file = request.files['file']
        if file.filename == '':
            logging.warning("No file selected")
            return "No file selected", 400

        # Save uploaded file
        filename = secure_filename(file.filename)
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(file_path)
        logging.info(f"File saved to {file_path}")

        # Check file extension
        file_extension = filename.rsplit('.', 1)[1].lower()
        if file_extension in ['jpg', 'jpeg', 'png']:
            # Process image
            img = cv2.imread(file_path)
            img_rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
            yolo = YOLO("yolov8n.pt")
            results = yolo.predict(img_rgb, save=True)

            # Save output image
            output_path = os.path.join("runs/detect", filename)
            cv2.imwrite(output_path, results[0].plot())
            return render_template('index.html', image_path=output_path)

        elif file_extension == 'mp4':
            # Process video
            cap = cv2.VideoCapture(file_path)
            frame_width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
            frame_height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))

            # Define output path
            output_video_path = os.path.join("runs/detect", "output.mp4")
            fourcc = cv2.VideoWriter_fourcc(*'mp4v')
            out = cv2.VideoWriter(output_video_path, fourcc, 30.0, (frame_width, frame_height))

            # Initialize YOLO model
            yolo = YOLO("yolov8n.pt")
            while cap.isOpened():
                ret, frame = cap.read()
                if not ret:
                    break
                results = yolo.predict(frame)
                res_plotted = results[0].plot()
                out.write(res_plotted)
            cap.release()
            out.release()
            return render_template('index.html', video_path=output_video_path)

        else:
            logging.warning("Unsupported file format")
            return "Unsupported file format. Please upload an image or video.", 400

    return render_template('index.html')


@app.route('/uploads/<filename>')
def uploaded_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)


@app.route('/runs/detect/<filename>')
def output_file(filename):
    return send_from_directory('runs/detect', filename)


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
