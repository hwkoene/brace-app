
import json
import os
import sys

from lib.point import Point
from lib.loader import *

if __name__ == "__main__":
    brace_vertices = load_brace("../assets/brace.stl")
    sensors, sensor_max_val, sensor_radius = load_sensors("../assets/sensors.json")

    # Add colors to datapoints
    data_folder = os.listdir("../assets/data")
    for file_index in range(0, len(data_folder)):
        filestream = open("../assets/data/" + data_folder[file_index])
        j = json.load(filestream)

        sensor_values = j["measured_values"]
        for sensor_index in range(0, len(sensors)):
            sensors[sensor_index].value = sensor_values[sensor_index]

        print("Calculating colors... (%d/%d)" % (file_index+1, len(data_folder)))

        # If no colors have been calculated yet or calculation is forced
        if len(j["mesh_colors"]) == 0 or '-f' in sys.argv:

            for vertex in brace_vertices:
                vertex.value = max([((sensor_radius - min(vertex.distance_to(sensor), sensor_radius))/sensor_radius)*sensor.value for sensor in sensors])

            colors = [v.value for v in brace_vertices]

            # Write to file
            filestream.close()
            filestream = open("../assets/data/" + data_folder[file_index], "w")
            json.dump({"index": j["index"], "timestamp": j["timestamp"], "measured_values": sensor_values, "mesh_colors": colors}, filestream, separators=(',\n', ': '))
