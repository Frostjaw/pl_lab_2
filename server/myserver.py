from http.server import HTTPServer, BaseHTTPRequestHandler
import os
import json

class myHandler(BaseHTTPRequestHandler):
	def do_GET(self):
		#убирает GET-запрос к favicon.ico
		if (self.path == '/favicon.ico'): return

		#обрабатывает GET-запрос к localhost:8000
		if (self.path=='/'):
			self.path='/mysite.html'

		#парсинг по '?' для запросов с параметрами
		temp = self.path.split('?')
		path = temp[0]
		cwd = os.getcwd() + path #текущая директория
		
		#обработка запросов к html/css/js файлам
		if os.path.splitext(cwd)[1] == '.html':
			f = open(cwd,'rb')
			self.send_response(200)
			self.send_header('Content-type','text/html')
			self.end_headers()
			self.wfile.write(f.read())
			return
		if os.path.splitext(cwd)[1] == '.css':
			f = open(cwd,'rb')
			self.send_response(200)
			self.send_header('Content-type','text/css')
			self.end_headers()
			self.wfile.write(f.read())
			return
		if os.path.splitext(cwd)[1] == '.js':
			f = open(cwd,'rb')
			self.send_response(200)
			self.send_header('Content-type','application/javascript')
			self.end_headers()
			self.wfile.write(f.read())
			return
			
		#проверка на запрос с параметром
		if len(temp) == 1:
			query = ''
		else:
			query = temp[1]
			temp_2 = query.split('=')
			query_name = temp_2[0]
			query_param = temp_2[1] #имя папки
			if query_name == 'createdir':
				os.mkdir(cwd+'/'+query_param)
			if query_name == 'deletedir':
				os.rmdir(cwd+'/'+query_param,dir_fd=None)

		#формирование ответа
		jsonarray = []
		self.send_response(200)
		if os.path.isfile(cwd): #ответ в виде файла
			f = open(cwd,'rb')
			self.send_header('content-disposition','attachment') 
			self.end_headers()
			self.wfile.write(f.read())
		else: #ответ в виде JSON-массива
			self.send_header('content-type','application/json')
			for listitem in os.listdir(cwd):
				listitem_path = os.path.join(cwd,listitem)
				json_string = {'Name':os.path.basename(listitem_path),'Size':os.stat(listitem_path).st_size}
				
				#проверка на файл\папку
				if os.path.isfile(listitem_path):
					json_string.update(Type='file')
				else:
					json_string.update(Type='folder')
					#проверка на пустоту папки
					if os.listdir(listitem_path):
						json_string.update(isEmpty='false')
					else:
						json_string.update(isEmpty='true')
				jsonarray.append(json_string)
			self.end_headers()
			self.wfile.write(bytes(json.dumps(jsonarray), 'utf-8'))

httpd = HTTPServer(("",8000), myHandler)
httpd.serve_forever()
