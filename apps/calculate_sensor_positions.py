
from lib.point import Point
from lib.loader import *


if __name__ == "__main__":
    brace_vertices = load_brace("../assets/brace.stl")
    sensors, _, _= load_sensors("../assets/sensors.json")

    for sensor in sensors:
        sensor.value = Point(10000, 10000, 1000)

        for vertex in brace_vertices:
            if sensor.distance_to(vertex) < sensor.distance_to(sensor.value):
                sensor.value = vertex

        print(str(sensor.value) + ",")
    