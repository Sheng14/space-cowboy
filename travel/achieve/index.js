window.deleteIt = function (e) {
    const resultEl = document.getElementById('result');
    const childrenList = resultEl.getElementsByTagName("tr");
    console.log(resultEl.children);
    console.log(resultEl.lastChild);
    const target = "看电影";
    console.log(childrenList);
}

window.addLine = function (e) { // 添加一行记录
    const resultEl = document.getElementById('result');
    const tr = document.createElement('tr');
    const color1 = Math.random() > 0.3 ? "success" : "info";
    const color2 = Math.random() > 0.6 ? "active" : "danger";
    const color = Math.random() > 0.5 ? color1 : color2
    tr.setAttribute("class", color);
    const td1 = document.createElement('td');
    const td1Text = document.createTextNode('看电影');
    td1.appendChild(td1Text);
    const td2 = document.createElement('td');
    const button = document.createElement('button');
    td2.appendChild(button);
    const buttonText = document.createTextNode('删除');
    button.addEventListener('click', deleteIt);
    button.setAttribute("class", "btn btn-danger");
    button.appendChild(buttonText);
    tr.appendChild(td1);
    tr.appendChild(td2);
    resultEl.appendChild(tr);
}