sub init()
    m.background = m.top.findNode("background")
    m.videoPlayer = m.top.findNode("videoPlayer")
    m.loadingGroup = m.top.findNode("loadingGroup")
    m.loadingBar = m.top.findNode("loadingBar")
    m.loginForm = m.top.findNode("loginForm")
    m.btnContinue = m.top.findNode("btnContinue")
    m.btnCancel = m.top.findNode("btnCancel")
    m.inputUser = m.top.findNode("inputUser")
    m.inputPass = m.top.findNode("inputPass")
    m.inputHost = m.top.findNode("inputHost")
    
    m.top.setFocus(true)
    
    ' Start Loading Animation
    m.loadingTimer = m.top.createChild("Timer")
    m.loadingTimer.duration = 0.05
    m.loadingTimer.repeat = true
    m.loadingTimer.observeField("fire", "updateLoading")
    m.loadingTimer.control = "start"
    m.progress = 0
    
    ' Focus management
    m.focusIndex = 0
    m.focusNodes = [m.inputUser, m.inputPass, m.inputHost, m.btnCancel, m.btnContinue]
end sub

sub updateLoading()
    m.progress = m.progress + 2
    if m.progress <= 100
        m.loadingBar.width = m.progress * 4
    else
        m.loadingTimer.control = "stop"
        m.loadingGroup.visible = false
        m.loginForm.visible = true
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

function onKeyEvent(key as String, press as Boolean) as Boolean
    if press
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
        else if key = "right" and m.focusIndex = 3
            m.focusIndex = 4
            m.focusNodes[m.focusIndex].setFocus(true)
            updateFocusVisuals()
            return true
        else if key = "left" and m.focusIndex = 4
            m.focusIndex = 3
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
        print "Iniciando Login..."
        ' Implement Xtream Login logic here
    else if node.id = "btnCancel"
        print "Cancelado"
    else
        ' Open Keyboard for inputs
        print "Abrindo teclado para: " + node.id
    end if
end sub
