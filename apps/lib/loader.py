
import json
from lib.point import Point


def load_brace(path):
    # Load vertex data
    with open(path) as filestream:
        lines = filestream.read().splitlines()
        
        # Filter vertices
        words = [x.split() for x in lines]
        return [Point(float(x[1]), float(x[2]), float(x[3])) for x in words if (x[0] == 'vertex')]


def load_sensors(path):
    with open(path) as filestream:
        data = json.load(filestream)
        return [Point(x[0], x[1], x[2]) for x in data["positions"]], data["max_value"], data["radius"]

