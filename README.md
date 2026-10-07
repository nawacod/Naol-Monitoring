# Naol Monitoring 👁️

Hey, I'm Naol. I built this project to help solve a massive problem in retail: backdoor theft and cash pocketing at the register. 

This is a computer vision and AI pipeline that watches live camera feeds to detect suspicious hand movements. I used OpenCV to track physical motion and Google Cloud Vertex AI to evaluate if someone actually picked up cash and concealed it in their pocket. If the AI confirms a theft, my backend instantly fires off a video clip of the incident directly to a phone via a Telegram bot. 

I also built a clean React web dashboard so you can easily upload test footage and watch the AI evaluate the scene in real-time.

### How to Run It Locally

If you want to download this and try it out on your own machine, it's pretty simple to get both the website and the AI engine running:

1. **Download the code:** Clone or download this repository to your computer.
2. **Start the Web Dashboard:** Open up the `frontend` folder in your terminal, install the dependencies, and run the app (using `npm run dev`). 
3. **Start the AI Engine:** Open a second terminal in the main folder and run the `posMonitoring.py` script. 

Once both are running, just open the local website link, click the upload button, and you can test the AI detection yourself!
