package com.assitenciaTecnica.logos.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.LocalDateTime;

/**
 * Registro de auditoria: quem criou, editou ou excluiu algo, em qual recurso e quando.
 * Gravado automaticamente pelo AuditoriaFilter para toda requisição de escrita da API.
 */
@Entity
@Table(name = "auditoria_log")
public class AuditoriaLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private LocalDateTime dataHora;

    @Column
    private String usuarioLogin;

    // CRIAR, EDITAR ou EXCLUIR
    @Column(nullable = false, length = 20)
    private String acao;

    // recurso da API, ex.: "clientes", "ordens-servico", "materiais"
    @Column(nullable = false, length = 100)
    private String entidade;

    // id do registro, quando aparece na URL
    @Column
    private Long registroId;

    @Column(length = 300)
    private String caminho;

    @Column(length = 10)
    private String metodo;

    @Column
    private Integer statusHttp;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public LocalDateTime getDataHora() { return dataHora; }
    public void setDataHora(LocalDateTime dataHora) { this.dataHora = dataHora; }

    public String getUsuarioLogin() { return usuarioLogin; }
    public void setUsuarioLogin(String usuarioLogin) { this.usuarioLogin = usuarioLogin; }

    public String getAcao() { return acao; }
    public void setAcao(String acao) { this.acao = acao; }

    public String getEntidade() { return entidade; }
    public void setEntidade(String entidade) { this.entidade = entidade; }

    public Long getRegistroId() { return registroId; }
    public void setRegistroId(Long registroId) { this.registroId = registroId; }

    public String getCaminho() { return caminho; }
    public void setCaminho(String caminho) { this.caminho = caminho; }

    public String getMetodo() { return metodo; }
    public void setMetodo(String metodo) { this.metodo = metodo; }

    public Integer getStatusHttp() { return statusHttp; }
    public void setStatusHttp(Integer statusHttp) { this.statusHttp = statusHttp; }
}
