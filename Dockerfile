FROM python:3.95
WORKDIR /code
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY index.html .
COPY main.py .
COPY changefolder.html .
COPY badimg.html . 
COPY goodimg.html .
EXPOSE 8080
CMD ["python", "./main.py"]