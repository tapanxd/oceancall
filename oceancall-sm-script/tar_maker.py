import tarfile

with tarfile.open("model.tar.gz", "w:gz") as tar:
    tar.add("inference.py")
    tar.add("whale_xgb_model.pkl")
    tar.add("class_map.pkl")