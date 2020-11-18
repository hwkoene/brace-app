
class Point:

    def __init__(self, x, y, z, val=None):
        self.x = x
        self.y = y
        self.z = z
        self.value = val

    def distance_to(self, p):
        return ((self.x-p.x)**2 + (self.y-p.y)**2 + (self.z-p.z)**2)**.5

    def __str__(self):
        return "[" + f'{self.x:.3f}' + ", " + f'{self.y:.3f}' + ", " + f'{self.z:.3f}' + (f'{self.value:.3f}' + ", " if self.value != None else "") + "]" 