// Envia o arquivo para o servidor
document.getElementById('uploadForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('arquivo', document.getElementById('arquivo').files[0]);

    const resposta = await fetch('http://localhost:3000/upload', {
        method: 'POST',
        body: formData
    });

    if (resposta.ok) {
        alert('Upload feito com sucesso!');
        carregarImagens();
    } else {
        alert('Erro ao enviar arquivo...');
    }
});

// Carrega as imagens do servidor
async function carregarImagens() {
    const galeria = document.getElementById('galeria');
    galeria.innerHTML = '';

    const resposta = await fetch('http://localhost:3000/imagens');
    const imagens = await resposta.json();

    imagens.forEach(img => {
        const imgTag = document.createElement('img');
        imgTag.src = `uploads/${img.nome_arquivo}`;
        galeria.appendChild(imgTag);
    });
}

// Carrega as imagens assim que a página abre
carregarImagens();