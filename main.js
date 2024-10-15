function transferAllOwnedFiles() {
  var newOwnerEmail = 'email@dominio.com'; // E-mail do novo proprietário
  var query = "'me' in owners"; // Query para buscar arquivos onde você é o proprietário
  var pageToken = null;

  Logger.log('Iniciando a transferência de todos os arquivos do proprietário: ' + Session.getActiveUser().getEmail());

  do {
    // Usando a API do Google Drive para buscar até 1000 arquivos de sua propriedade
    var response = Drive.Files.list({
      q: query,
      pageToken: pageToken,
      fields: "nextPageToken, files(id, name)",
      pageSize: 1000 // Limite máximo de arquivos por página permitido pela API
    });

    var files = response.files;

    if (files && files.length > 0) {
      for (var i = 0; i < files.length; i++) {
        var file = files[i];
        
        try {
          // Adiciona permissão de proprietário ao novo e-mail
          Drive.Permissions.create({
            'role': 'owner', // Define como novo proprietário
            'type': 'user',
            'emailAddress': newOwnerEmail
          }, file.id, { 'transferOwnership': true });

          Logger.log('Propriedade do arquivo transferida: ' + file.name);

        } catch (e) {
          Logger.log('Erro ao transferir arquivo: ' + file.name + ' - ' + e.message);
        }
      }
    }

    // Atualiza o token da próxima página
    pageToken = response.nextPageToken;

  } while (pageToken); // Continua enquanto houver mais páginas de resultados

  Logger.log('Transferência de arquivos concluída.');
}
