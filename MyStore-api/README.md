# Projeto para teste de emprego de Reginaldo Pedro de Lima para vaga de Dev Angular na Empresa South System

Usuário "admin", password "admin" é criado automaticamente

Ambiente de produção no [reginalotestess.herokuapp.com] (https://reginalotestess.herokuapp.com)

Dentro do Projeto há um arquivo de importação para o insomnia com as rotas e configurações para os testes

Para fazer testes unitário de Rota foi utilizado jest, SuperTest e Mongo em memória:

```
Verificar se a API está no ar
Verificar o Login
Verificar Cadastro de Usuário Novo
Verificar Cadastro de Usuário com username Vazio
Verificar Cadastro de Usuário com password Vazio
Verificar Cadastro de Usuário com email Vazio
Usuário - Verificar cadastro de 2 usuário com mesmo nome
Usuário - Verificar cadastro de 2 usuário com mesmo Email
```

## Rotas:

Login:
    post: /api/auth/signin

Add User
    post: /api/user

Update User
    put: /api/user

ListUsers
    get: /api/user


Add Product
    post: /api/product

Update Product
    put: /api/product

Delete Product
    delete: /api/product/:id

Get Product
    get: /api/product/:id

List Products
    get: /api/product?search=text&page=4&limit=10
    
as Opções search, page e  limit são opcionais


