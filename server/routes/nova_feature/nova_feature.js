const router = require('express').Router();
const { errHandling } = require('../../utils/utils');
const cookieParser = require('cookie-parser');
const { getUserById, updateUsername } = require('../../service/service');
const multer = require('multer');
const path = require('path');

router.use(cookieParser());

const renderData = {};

// Middleware Multer para lidar com uploads de arquivos
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Diretório onde vai salvar as imagens
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // Limita o tamanho do arquivo a 5 MB 
  },
  fileFilter: function (req, file, cb) {
    if (file.mimetype.startsWith('image/jpeg')) {
      cb(null, true);
    } else {
      cb(new Error('Apenas arquivos JPEG são permitidos.'), false);
    }
  },
});

router.get(
	'/nova_feature',
	errHandling(async (req, res) => {
		const { user_id } = req.cookies;
		const usuarioNaoAutenticado = user_id == undefined;

		if (usuarioNaoAutenticado) {
			res.render('user-not-authenticated');
		} else {
			const { rows } = await getUserById(user_id);
			renderData.username = rows[0].username;
			res.render('nova_feature', renderData);
		}
	})
);

router.post(
	'/nova_feature/teste',
    upload.single('jpegFile'),
	errHandling(async (req, res) => {

		// Verifica se o upload foi bem-sucedido 
        if (req.file) {
            // O arquivo está disponível em req.file
            console.log('Upload bem-sucedido');
            console.log('Nome do arquivo:', req.file.filename);
    
            // Aqui redireciona o usuário para a página que deu certo, se quiserem fazer mais bonito e melhorar
            res.status(200).json({ message: 'Upload bem-sucedido' });
          } else {
            // Upload falhou 
            console.log('Erro no upload ou formato de imagem inválido');
            res.status(400).json({ error: 'Erro no upload ou formato de imagem inválido' });
          }
	})
);


module.exports = router;
