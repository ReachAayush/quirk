class NextButton:
	x1 = 0.0
	y1 = 0.0
	x2 = 0.0
	y2 = 0.0
	label = ""
	
	def __init__(self,x1,y1,x2,y2,label):
		self.x1=x1
		self.y1=y1
		self.x2=x2
		self.y2=y2
		self.label=label

	def isInside(self,x,y):
    	return x>=self.x1 & y>=self.y1 & x<=self.x2 & y<=self.y2

    def getLabel(self):
    	return self.label