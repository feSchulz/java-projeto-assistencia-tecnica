package com.assitenciaTecnica.logos.data.dto;

import java.time.LocalDateTime;

/** Uma linha do histórico de status de uma OS (status em nome de enum, ex.: "EM_ANDAMENTO"). */
public class HistoricoStatusDTO {

    private Long id;
    private String statusAnterior;
    private String statusNovo;
    private String funcionarioNome;
    private String funcionarioLogin;
    private LocalDateTime dataHora;
    private String observacao;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getStatusAnterior() { return statusAnterior; }
    public void setStatusAnterior(String statusAnterior) { this.statusAnterior = statusAnterior; }

    public String getStatusNovo() { return statusNovo; }
    public void setStatusNovo(String statusNovo) { this.statusNovo = statusNovo; }

    public String getFuncionarioNome() { return funcionarioNome; }
    public void setFuncionarioNome(String funcionarioNome) { this.funcionarioNome = funcionarioNome; }

    public String getFuncionarioLogin() { return funcionarioLogin; }
    public void setFuncionarioLogin(String funcionarioLogin) { this.funcionarioLogin = funcionarioLogin; }

    public LocalDateTime getDataHora() { return dataHora; }
    public void setDataHora(LocalDateTime dataHora) { this.dataHora = dataHora; }

    public String getObservacao() { return observacao; }
    public void setObservacao(String observacao) { this.observacao = observacao; }
}
