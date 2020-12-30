import * as speechCommands from '@tensorflow-models/speech-commands';

const MODEL_PATH = 'http://127.0.0.1:8080';
let transferRecognizer; // 把学习器定义在最外面方便访问
let ADDCONTENT= '';
let DELETETARGET = '';

window.onload = async () => {
    console.log('进入')
    const recognizer = speechCommands.create(
        'BROWSER_FFT',
        null,
        MODEL_PATH + '/model.json',
        MODEL_PATH + '/metadata.json'
    );
    await recognizer.ensureModelLoaded();
    transferRecognizer = recognizer.createTransfer('语音助手');
    const res = await fetch(MODEL_PATH + '/data5.bin'); // 拿到下载的数据
    const arrayBuffer = await res.arrayBuffer(); // 转换成buffer
    transferRecognizer.loadExamples(arrayBuffer); // 把数据放到模型中
    await transferRecognizer.train({epochs: 120}); // 训练
    alert('训练完成，可以开始语音识别');
};

window.toggle = async (checked) => { // 切换是否监听
    if (checked) {
        await transferRecognizer.listen( result => {
            console.log('开始')
            const { scores } = result;
            const labels = transferRecognizer.wordLabels();
            const index = scores.indexOf(Math.max(...scores)); // 拿到最符合语音的单词！
            console.log(labels[index]);
            if (labels[index] === 'add' && ADDCONTENT) { // 目的是添加且有添加值时
                if (ADDCONTENT !== 'add' && ADDCONTENT !== 'delete') {
                    window.addLine()
                    ADDCONTENT = ''
                    DELETETARGET = ''
                }
            } else if (labels[index] === 'delete' && DELETETARGET) { // 目的是删除且有删除值时
                if (DELETETARGET !== 'add' || DELETETARGET !== 'delete') {
                    window.deleteIt()
                    DELETETARGET = ''
                    ADDCONTENT = ''
                }
            } else {
                ADDCONTENT = labels[index];
                DELETETARGET = labels[index];
            }
        },{
            overlapFactor: 0.5,
            probabilityThreshold: 0.6
        })
    } else {
        transferRecognizer.stopListening();
    }
}

window.deleteIt = function (e) { // 删除一个子元素
    console.log('删除')
    const resultEl = document.getElementById('result');
    const childrenList = resultEl.getElementsByTagName("tr");
   // const target = "睡觉"; // 要删除的子元素目标（用文字为标识）
    for (let i = childrenList.length -1 ; i >= 0; i--) { // 删除与目标文字对应的子元素
        console.log(childrenList[i].innerText)
        if (childrenList[i].innerText.indexOf(DELETETARGET) !== -1) { // 即找到对应的目标元素就删除！
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
   // const td1Text = document.createTextNode('看电影');
   const td1Text = document.createTextNode(ADDCONTENT);
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