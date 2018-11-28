// JavaScript source code
showFolder('/main');

function showFolder(path) {
	let request = new XMLHttpRequest();
	request.open('GET',path);
	request.responseType = 'json';
	request.send()
	request.onload = function() {
		let requestResponse = request.response;
		drawList(requestResponse,path);
	}
}

function sendrequest(requestURL) {
	let request = new XMLHttpRequest();
	request.open('GET',requestURL);
	request.responseType = 'json';
	request.send()
}

function drawList(jsonObj,curdir) {
	//проверка на наличие content_div (для 1 запуска)
	if (!document.getElementById('content_div')) {
		let content_div = document.createElement('div');
		content_div.id = 'content_div';
		document.body.appendChild(content_div);
	}
	else {
		let content_div = document.getElementById('content_div');
	}
	
	//отрисовка h2
	let content_h2 = document.createElement('h2');
	content_h2.textContent = 'List directory for localhost:8000' + curdir;
	content_div.appendChild(content_h2);
	
	//отрисовка ul
	let list_ul = document.createElement('ul');
	for (let i=0;i<jsonObj.length;i++){
		//отрисовка элемента
		let new_li = document.createElement('li');
		let new_li_content_div = document.createElement('div');
		new_li_content_div.textContent = jsonObj[i].Name;
		if (jsonObj[i].Type == 'file') { //отрисовка размера только для файлов
			new_li_content_div.textContent += ' (Размер: ' + jsonObj[i].Size + 'B)';
		}
		new_li_content_div.addEventListener("click",function(){
			if (jsonObj[i].Type == 'folder') {
				content_div.innerHTML = '';
				showFolder(curdir + '/' + jsonObj[i].Name);
			}
			else {window.location.href = curdir + '/' + jsonObj[i].Name;}
		}
		)
		new_li.appendChild(new_li_content_div);
		
		//отрисовка кнопки 'удалить' для папок
		if (jsonObj[i].Type == 'folder' && jsonObj[i].isEmpty == 'true'){
			let new_li_delete_button = document.createElement('button');
			new_li_delete_button.textContent = 'Удалить';
			new_li_delete_button.addEventListener("click",function(){
				content_div.innerHTML = ''; //очистка ul
				sendrequest(curdir+'?deletedir='+jsonObj[i].Name); //запрос на создание
				showFolder(curdir); //показ обновленной директории
				}
			)
			new_li.appendChild(new_li_delete_button);
		}		
		list_ul.appendChild(new_li);		
	}
	content_div.appendChild(list_ul);
	
	//создание папки
	let create_folder_div = document.createElement('div');
	create_folder_div.id = 'create_folder_div';
	create_folder_div.textContent = 'Создать папку';
	let create_folder_div_input = document.createElement('input');
	create_folder_div_input.placeholder = 'Введите название';
	create_folder_div.appendChild(create_folder_div_input);
	let create_folder_div_button = document.createElement('button');
	create_folder_div_button.textContent = 'Создать';
	create_folder_div.appendChild(create_folder_div_button);
	create_folder_div_button.addEventListener("click",function(){
		content_div.innerHTML = '';
		sendrequest(curdir+'?createdir='+create_folder_div_input.value);
		showFolder(curdir);
		}
	)
	content_div.appendChild(create_folder_div);
	
	//кнопка 'Назад' 
	if (curdir == '/main') return; //для '/main' не отрисовывается
	let back_li = document.createElement('li');
	back_li.textContent = 'Назад';
	back_li.addEventListener("click",function(){
		content_div.innerHTML = '';
		let temp = curdir.split('/');
		let new_request = '';
		for (let i=1;i<temp.length - 1;i++){
			new_request += '/' + temp[i];
		}
		showFolder(new_request);			
		}
	)
	list_ul.appendChild(back_li);
	
}