package com.assitenciaTecnica.logos.data.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

/**
 * Dados da tela "Meu perfil" (GET/PUT /api/auth/v1/me).
 *
 * DTO propositalmente plano: só texto e números, sem entidades JPA aninhadas.
 * Assim a resposta não depende do Dozer nem da serialização de entidades
 * (proxies do Hibernate, ciclos, cópias de Usuario/Endereco/Cidade), que
 * foram a origem dos erros anteriores nessa tela.
 *
 * Na leitura, vêm preenchidos id, login, papelCodigo/papelNome e os demais
 * campos. Na escrita, só os campos editáveis são usados: login e papel nunca
 * são alterados por essa rota, mesmo que venham no corpo.
 */
@JsonIgnoreProperties(ignoreUnknown = true)
public class PerfilDTO {

    private Long id;
    private String login;
    private String papelCodigo;
    private String papelNome;

    private String nome;
    private String cpf;
    private String telefone;
    private String email;

    private String rua;
    private Long numero;
    private String bairro;
    private String complemento;
    private String cep;
    private Long cidadeId;
    private String cidadeNome;
    private Long estadoId;
    private String estadoNome;

    // Nova senha em texto puro (opcional). Só entra na requisição; nunca sai na resposta.
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private String senha;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getLogin() { return login; }
    public void setLogin(String login) { this.login = login; }

    public String getPapelCodigo() { return papelCodigo; }
    public void setPapelCodigo(String papelCodigo) { this.papelCodigo = papelCodigo; }

    public String getPapelNome() { return papelNome; }
    public void setPapelNome(String papelNome) { this.papelNome = papelNome; }

    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }

    public String getCpf() { return cpf; }
    public void setCpf(String cpf) { this.cpf = cpf; }

    public String getTelefone() { return telefone; }
    public void setTelefone(String telefone) { this.telefone = telefone; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getRua() { return rua; }
    public void setRua(String rua) { this.rua = rua; }

    public Long getNumero() { return numero; }
    public void setNumero(Long numero) { this.numero = numero; }

    public String getBairro() { return bairro; }
    public void setBairro(String bairro) { this.bairro = bairro; }

    public String getComplemento() { return complemento; }
    public void setComplemento(String complemento) { this.complemento = complemento; }

    public String getCep() { return cep; }
    public void setCep(String cep) { this.cep = cep; }

    public Long getCidadeId() { return cidadeId; }
    public void setCidadeId(Long cidadeId) { this.cidadeId = cidadeId; }

    public String getCidadeNome() { return cidadeNome; }
    public void setCidadeNome(String cidadeNome) { this.cidadeNome = cidadeNome; }

    public Long getEstadoId() { return estadoId; }
    public void setEstadoId(Long estadoId) { this.estadoId = estadoId; }

    public String getEstadoNome() { return estadoNome; }
    public void setEstadoNome(String estadoNome) { this.estadoNome = estadoNome; }

    public String getSenha() { return senha; }
    public void setSenha(String senha) { this.senha = senha; }
}
