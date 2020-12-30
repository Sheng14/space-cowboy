window.deleteIt = function (e) { // 删除一个子元素
    const resultEl = document.getElementById('result');
    const childrenList = resultEl.getElementsByTagName("tr");
    const target = "睡觉"; // 要删除的子元素目标（用文字为标识）
    for (let i = childrenList.length -1 ; i >= 0; i--) { // 删除与目标文字对应的子元素
        console.log(childrenList[i].innerText)
        if (childrenList[i].innerText.indexOf(target) !== -1) { // 即找到对应的目标元素就删除！
            resultEl.removeChild(childrenList[i])
        }
    }
    /*for (let i = childrenList.length -1 ; i >= 0; i--) { // 删除所有的子元素
        console.log(i);
        childrenList[i].parentNode.removeChild(childrenList[i])
    }*/
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