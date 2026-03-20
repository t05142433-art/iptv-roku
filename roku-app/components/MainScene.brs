sub init()
    m.videoPlayer = m.top.findNode("videoPlayer")
    m.loadingGroup = m.top.findNode("loadingGroup")
    m.loadingBar = m.top.findNode("loadingBar")
    m.loginContainer = m.top.findNode("loginContainer")
    m.keyboard = m.top.findNode("keyboard")
    m.btnContinue = m.top.findNode("btnContinue")
    m.btnCancel = m.top.findNode("btnCancel")
    m.rectUser = m.top.findNode("rectUser")
    m.rectPass = m.top.findNode("rectPass")
    m.rectHost = m.top.findNode("rectHost")
    m.valUser = m.top.findNode("valUser")
    m.valPass = m.top.findNode("valPass")
    m.valHost = m.top.findNode("valHost")
    
    m.connectingGroup = m.top.findNode("connectingGroup")
    m.connectingBar = m.top.findNode("connectingBar")
    m.connHost = m.top.findNode("connHost")
    m.connUser = m.top.findNode("connUser")
    m.connPass = m.top.findNode("connPass")
    m.connStatus = m.top.findNode("connStatus")
    
    m.dashboard = m.top.findNode("dashboard")
    m.categoryList = m.top.findNode("categoryList")
    m.streamList = m.top.findNode("streamList")
    
    m.top.setFocus(true)
    
    ' Initial Loading
    m.loadingTimer = m.top.createChild("Timer")
    m.loadingTimer.duration = 0.02
    m.loadingTimer.repeat = true
    m.loadingTimer.observeField("fire", "updateLoading")
    m.loadingTimer.control = "start"
    m.progress = 0
    
    m.focusIndex = 0
    m.focusNodes = [m.rectUser, m.rectPass, m.rectHost, m.btnCancel, m.btnContinue]
    m.isKeyboardActive = false
    m.isDashboardActive = false
    m.isConnecting = false
    
    m.keyboard.observeField("text", "onKeyboardTextChange")
    m.categoryList.observeField("itemFocused", "onCategoryFocused")
    m.streamList.observeField("itemSelected", "onStreamSelected")
end sub

sub updateLoading()
    m.progress = m.progress + 2
    if m.progress <= 100
        m.loadingBar.width = m.progress * 6
    else
        m.loadingTimer.control = "stop"
        m.loadingGroup.visible = false
        m.loginContainer.visible = true
        m.focusNodes[m.focusIndex].setFocus(true)
        updateFocusVisuals()
    end if
end sub

sub updateFocusVisuals()
    for i = 0 to m.focusNodes.count() - 1
        node = m.focusNodes[i]
        if i = m.focusIndex
            node.color = "0xff007f"
            if node.id = "btnCancel" then node.color = "0x666666"
        else
            node.color = "0x222222"
            if node.id = "btnCancel" then node.color = "0x444444"
            if node.id = "btnContinue" then node.color = "0x880044"
        end if
    end for
end sub

sub onKeyboardTextChange()
    if m.focusIndex = 0 then m.valUser.text = m.keyboard.text
    if m.focusIndex = 1 then m.valPass.text = m.keyboard.text
    if m.focusIndex = 2 then m.valHost.text = m.keyboard.text
    
    ' Reset color if text entered
    if m.keyboard.text <> ""
        if m.focusIndex = 0 then m.valUser.color = "0xffffff"
        if m.focusIndex = 1 then m.valPass.color = "0xffffff"
        if m.focusIndex = 2 then m.valHost.color = "0xffffff"
    end if
end sub

function onKeyEvent(key as String, press as Boolean) as Boolean
    if press
        if m.isKeyboardActive
            if key = "back"
                m.keyboard.visible = false
                m.isKeyboardActive = false
                m.focusNodes[m.focusIndex].setFocus(true)
                return true
            end if
            return false
        end if

        if m.isDashboardActive
            if key = "back"
                if m.videoPlayer.visible
                    m.videoPlayer.control = "stop"
                    m.videoPlayer.visible = false
                    m.dashboard.visible = true
                    m.streamList.setFocus(true)
                    return true
                end if
                m.dashboard.visible = false
                m.loginContainer.visible = true
                m.isDashboardActive = false
                m.focusNodes[m.focusIndex].setFocus(true)
                return true
            end if
            return false
        end if

        if key = "down"
            m.focusIndex = (m.focusIndex + 1) mod m.focusNodes.count()
            m.focusNodes[m.focusIndex].setFocus(true)
            updateFocusVisuals()
            return true
        else if key = "up"
            m.focusIndex = m.focusIndex - 1
            if m.focusIndex < 0 then m.focusIndex = m.focusNodes.count() - 1
            m.focusNodes[m.focusIndex].setFocus(true)
            updateFocusVisuals()
            return true
        else if key = "OK"
            handleAction()
            return true
        end if
    end if
    return false
end function

sub handleAction()
    node = m.focusNodes[m.focusIndex]
    if node.id = "btnContinue"
        startConnectionAnimation()
    else if node.id = "btnCancel"
        ' FECHAR O APP (CANCELAR)
        m.top.close = true
    else
        ' Open Keyboard
        m.keyboard.text = ""
        currentVal = ""
        if node.id = "rectUser" then currentVal = m.valUser.text
        if node.id = "rectPass" then currentVal = m.valPass.text
        if node.id = "rectHost" then currentVal = m.valHost.text
        
        if currentVal.instr("Digite") = -1 and currentVal.instr("http") = -1
            m.keyboard.text = currentVal
        end if
        
        m.keyboard.visible = true
        m.keyboard.setFocus(true)
        m.isKeyboardActive = true
    end if
end sub

sub startConnectionAnimation()
    m.loginContainer.visible = false
    m.connectingGroup.visible = true
    m.isConnecting = true
    
    m.connHost.text = "HOST: " + m.valHost.text
    m.connUser.text = "USER: " + m.valUser.text
    m.connPass.text = "PASS: ********"
    
    m.connProgress = 0
    m.connTimer = m.top.createChild("Timer")
    m.connTimer.duration = 0.05
    m.connTimer.repeat = true
    m.connTimer.observeField("fire", "updateConnProgress")
    m.connTimer.control = "start"
end sub

sub updateConnProgress()
    m.connProgress = m.connProgress + 2
    m.connectingBar.width = m.connProgress * 6
    
    if m.connProgress = 20 then m.connStatus.text = "Validando Host..."
    if m.connProgress = 40 then m.connStatus.text = "Autenticando Usuário..."
    if m.connProgress = 60 then m.connStatus.text = "Baixando Lista de Canais..."
    if m.connProgress = 80 then m.connStatus.text = "Preparando Interface 3D..."
    
    if m.connProgress >= 100
        m.connTimer.control = "stop"
        connectIPTV()
    end if
end sub

sub connectIPTV()
    url = m.valHost.text + "/player_api.php?username=" + m.valUser.text + "&password=" + m.valPass.text
    m.transfer = CreateObject("roUrlTransfer")
    m.transfer.SetUrl(url)
    m.transfer.SetCertificatesFile("common:/certs/ca-bundle.crt")
    m.transfer.InitClientCertificates()
    
    response = m.transfer.GetToString()
    if response <> ""
        json = ParseJson(response)
        if json <> invalid and json.user_info <> invalid
            m.connectingGroup.visible = false
            m.dashboard.visible = true
            m.isDashboardActive = true
            loadCategories()
        else
            m.connStatus.text = "ERRO: Credenciais Inválidas!"
            m.connStatus.color = "0xff0000"
            ' Voltar após erro
        end if
    else
        m.connStatus.text = "ERRO: Servidor Offline!"
        m.connStatus.color = "0xff0000"
    end if
end sub

sub loadCategories()
    url = m.valHost.text + "/player_api.php?username=" + m.valUser.text + "&password=" + m.valPass.text + "&action=get_live_categories"
    m.transfer.SetUrl(url)
    response = m.transfer.GetToString()
    if response <> ""
        m.categories = ParseJson(response)
        content = CreateObject("roSGNode", "ContentNode")
        for each cat in m.categories
            item = content.createChild("ContentNode")
            item.title = cat.category_name
        end for
        m.categoryList.content = content
        m.categoryList.setFocus(true)
    end if
end sub

sub onCategoryFocused()
    catIndex = m.categoryList.itemFocused
    catId = m.categories[catIndex].category_id
    loadStreams(catId)
end sub

sub loadStreams(catId)
    url = m.valHost.text + "/player_api.php?username=" + m.valUser.text + "&password=" + m.valPass.text + "&action=get_live_streams&category_id=" + catId
    m.transfer.SetUrl(url)
    response = m.transfer.GetToString()
    if response <> ""
        m.streams = ParseJson(response)
        content = CreateObject("roSGNode", "ContentNode")
        for each stream in m.streams
            item = content.createChild("ContentNode")
            item.title = stream.name
        end for
        m.streamList.content = content
    end if
end sub

sub onStreamSelected()
    streamIndex = m.streamList.itemSelected
    stream = m.streams[streamIndex]
    playStream(stream.stream_id)
end sub

sub playStream(streamId)
    ' MPEG-TS Stream URL (mgets)
    url = m.valHost.text + "/live/" + m.valUser.text + "/" + m.valPass.text + "/" + streamId.ToStr() + ".ts"
    
    content = CreateObject("roSGNode", "ContentNode")
    content.url = url
    content.streamformat = "ts"
    
    m.videoPlayer.content = content
    m.videoPlayer.visible = true
    m.videoPlayer.setFocus(true)
    m.videoPlayer.control = "play"
end sub
