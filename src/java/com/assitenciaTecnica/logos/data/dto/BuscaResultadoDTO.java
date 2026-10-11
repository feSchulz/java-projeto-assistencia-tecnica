package com.assitenciaTecnica.logos.data.dto;

import java.util.ArrayList;
import java.util.List;

/** Resultado da busca global, agrupado por tipo (até 5 itens de cada). */
public class BuscaResultadoDTO {

    private List<BuscaItemDTO> ordens = new ArrayList<>();
    private List<BuscaItemDTO> clientes = new ArrayList<>();
    private List<BuscaItemDTO> equipamentos = new ArrayList<>();

    public List<BuscaItemDTO> getOrdens() { return ordens; }
    public void setOrdens(List<BuscaItemDTO> ordens) { this.ordens = ordens; }

    public List<BuscaItemDTO> getClientes() { return clientes; }
    public void setClientes(List<BuscaItemDTO> clientes) { this.clientes = clientes; }

    public List<BuscaItemDTO> getEquipamentos() { return equipamentos; }
    public void setEquipamentos(List<BuscaItemDTO> equipamentos) { this.equipamentos = equipamentos; }
}
