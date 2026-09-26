package com.assitenciaTecnica.logos.data.dto;

import java.util.List;
import com.assitenciaTecnica.logos.model.Funcionario;

public class PapelDTO {

    private Long id;
    private String codigo;
    private String nome;
    private List<Funcionario> funcionarios;
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCodigo() {
        return codigo;
    }

    public void setCodigo(String codigo) {
        this.codigo = codigo;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public List<Funcionario> getFuncionarios() {
        return funcionarios;
    }

    public void setFuncionarios(List<Funcionario> funcionarios) {
        this.funcionarios = funcionarios;
    }
}
