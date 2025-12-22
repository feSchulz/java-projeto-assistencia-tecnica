package com.assitenciaTecnica.logos.data.dto;

public class LoginResponseDTO {
    private String mensagem;
    private String papel;
    private Long usuarioId;

    public LoginResponseDTO(String mensagem, String papel, Long usuarioId) {
        this.mensagem = mensagem;
        this.papel = papel;
        this.usuarioId = usuarioId;
    }

    public String getMensagem() {
        return mensagem;
    }
    public void setMensagem(String mensagem) {
        this.mensagem = mensagem;
    }

    public String getPapel() {
        return papel;
    }
    public void setPapel(String papel) {
        this.papel = papel;
    }

    public Long getUsuarioId() {
        return usuarioId;
    }
    public void setUsuarioId(Long usuarioId) {
        this.usuarioId = usuarioId;
    }
}