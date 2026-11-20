package com.assitenciaTecnica.logos.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.LocalDateTime;

/**
 * Registro de cada mudança de status de uma ordem de serviço (quem mudou,
 * quando, de qual status para qual). Guarda só o id da OS (sem chave
 * estrangeira) para não atrapalhar a exclusão da OS; o service apaga o
 * histórico junto com ela.
 */
@Entity
@Table(name = "historico_status_os")
public class HistoricoStatusOS {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long ordemServicoId;

    // null na criação da OS
    @Column
    private Long statusAnterior;

    @Column(nullable = false)
    private Long statusNovo;

    @Column
    private String funcionarioLogin;

    @Column
    private String funcionarioNome;

    @Column(nullable = false)
    private LocalDateTime dataHora;

    @Column(length = 500)
    private String observacao;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getOrdemServicoId() { return ordemServicoId; }
    public void setOrdemServicoId(Long ordemServicoId) { this.ordemServicoId = ordemServicoId; }

    public Long getStatusAnterior() { return statusAnterior; }
    public void setStatusAnterior(Long statusAnterior) { this.statusAnterior = statusAnterior; }

    public Long getStatusNovo() { return statusNovo; }
    public void setStatusNovo(Long statusNovo) { this.statusNovo = statusNovo; }

    public String getFuncionarioLogin() { return funcionarioLogin; }
    public void setFuncionarioLogin(String funcionarioLogin) { this.funcionarioLogin = funcionarioLogin; }

    public String getFuncionarioNome() { return funcionarioNome; }
    public void setFuncionarioNome(String funcionarioNome) { this.funcionarioNome = funcionarioNome; }

    public LocalDateTime getDataHora() { return dataHora; }
    public void setDataHora(LocalDateTime dataHora) { this.dataHora = dataHora; }

    public String getObservacao() { return observacao; }
    public void setObservacao(String observacao) { this.observacao = observacao; }
}
