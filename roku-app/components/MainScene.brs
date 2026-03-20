sub init()
    m.background = m.top.findNode("background")
    m.videoPlayer = m.top.findNode("videoPlayer")
    m.btnContinue = m.top.findNode("btnContinue")
    
    m.top.setFocus(true)
    
    ' Animação simples da logo
    m.logoGroup = m.top.findNode("logoGroup")
    m.logoThayson = m.top.findNode("logoThayson")
    
    ' Focar no botão continuar por padrão
    m.btnContinue.setFocus(true)
end sub

function onKeyEvent(key as String, press as Boolean) as Boolean
    if press
        if key = "OK"
            ' Lógica de Login e Conexão IPTV aqui
            print "Botão OK pressionado - Conectando ao Host..."
            handleLogin()
        end if
    end if
    return false
end function

sub handleLogin()
    ' Aqui entraria a requisição real para o player_api.php
    ' Por ser Roku nativo, usamos o objeto roUrlTransfer
    print "Iniciando autenticação Xtream..."
end sub
