import * as speechCommands from '@tensorflow-models/speech-commands';
import * as tfvis from '@tensorflow/tfjs-vis';

const MODEL_PATH = 'http://127.0.0.1:8080';
let transferRecognizer; // 把学习器定义在最外面方便访问

window.onload = async () => {
    const recognizer = speechCommands.create( // 先定义一个识别器
        'BROWSER_FFT',
        null,
        MODEL_PATH + '/model.json',
        MODEL_PATH + '/metadata.json'
    );
    await recognizer.ensureModelLoaded();
    transferRecognizer = recognizer.createTransfer('语音助手'); // 创建学习器
}

window.collect = async(btn) => { // 定义collect方法
    btn.disabled = true; // 首先点击了就禁用
    const label = btn.innerText;
    await transferRecognizer.collectExample(
        label === 'background' ? '_background_noise_' : label
    ); // 将按钮对应的内容传入收集对应内容的语言，背景噪音则利用预留下来的字符串即可
    btn.disabled = false; // 收集完成则关闭禁用
    document.querySelector('#count').innerHTML = JSON.stringify(transferRecognizer.countExamples(), null, 2); // 将收集内容显示于界面且空格
}

window.train = async () => { // 训练方法
    await transferRecognizer.train({
        epochs: 100,
        callback: tfvis.show.fitCallbacks(
            {name: '训练效果'},
            ['loss', 'acc'],
            {callbacks: ['onEpochEnd']}
        )
    });
};

window.toggle = async (checked) => { // 是否监听
    if (checked) { // 如果勾选了则输出对应坐标
        await transferRecognizer.listen( result => {
            const { scores } = result;
            const labels = transferRecognizer.wordLabels();
            const index = scores.indexOf(Math.max(...scores));
            console.log(labels[index]);
        },{
            overlapFactor: 0,
            probabilityThreshold: 0.75
        })
    } else {
        transferRecognizer.stopListening(); // 如果不勾选则停止监听
    }
};

window.save = async () => { // 对录制的语音训练数据进行保存
    const arrayBuffer = transferRecognizer.serializeExamples(); // 首先转换成buffer
    const blob = new Blob([arrayBuffer]); // 再转换成blob
    const link = document.createElement('a'); // 创建a标签来制造点击下载
    link.href = window.URL.createObjectURL(blob);
    link.download = 'data.bin'; // 指明下载名称
    link.click(); // 模拟点击a标签的操作
}