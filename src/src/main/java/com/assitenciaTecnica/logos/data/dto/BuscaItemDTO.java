package com.assitenciaTecnica.logos.data.dto;

/** Um resultado da busca global (ordem de serviço, cliente ou equipamento). */
public class BuscaItemDTO {

    private Long id;
    private String titulo;
    private String subtitulo;
    // Só para ordens de serviço (nome do enum, ex.: "EM_ANDAMENTO").
    private String status;

    public BuscaItemDTO() {}

    public BuscaItemDTO(Long id, String titulo, String subtitulo, String status) {
        this.id = id;
        this.titulo = titulo;
        this.subtitulo = subtitulo;
        this.status = status;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitulo() { return titulo; }
    public void setTitulo(String titulo) { this.titulo = titulo; }

    public String getSubtitulo() { return subtitulo; }
    public void setSubtitulo(String subtitulo) { this.subtitulo = subtitulo; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
