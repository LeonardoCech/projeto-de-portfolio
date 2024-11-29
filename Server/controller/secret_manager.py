from google.cloud import secretmanager


def access_secret_version(project_id, secret_id, version_id="latest"):
    """
    Acessa a versão de um segredo armazenado no Secret Manager.
    
    :param project_id: ID do projeto GCP
    :param secret_id: ID do segredo no Secret Manager
    :param version_id: Versão do segredo (padrão é "latest")
    :return: O valor do segredo
    """
    # Cria o cliente do Secret Manager
    client = secretmanager.SecretManagerServiceClient()
    
    # Constrói o nome do recurso do segredo
    name = f"projects/{project_id}/secrets/{secret_id}/versions/{version_id}"
    
    # Acessa o segredo
    response = client.access_secret_version(name=name)
    
    # Retorna o payload do segredo
    return response.payload.data.decode("UTF-8")
