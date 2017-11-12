/**
 * 
 */

import rp from 'request-promise'
import { telegram as configs } from '../configs/configs'

class TelegramClient {

    constructor(ApiToken) {
        this.ApiReq = rp.defaults({
            baseUrl: `${configs.base_url}${ApiToken}`,
            headers: { 'Content-Type': 'application/json' }
        })
        
        return {
            listen: this.ListenMessages.bind(this),
            reply: this.ReplyMessage.bind(this)
        }
    }

    ListenMessages(baseHookUrl) {
        if (typeof baseHookUrl === 'undefined') {
            throw new Error('You have to set "listenerUrl" before injecting client listener.').message
            return
        }
        this.SetHook(baseHookUrl, {
            allowed_updates: ['message', 'callback_query']
        })
    }

    SetHook(url, options = {}) {
        if (typeof url === 'undefined') {
            throw new Error('You have to set "listenerUrl" before injecting client listener.').message
            return
        }
        let opts = Object.assign({}, { url: url }, options)
        this.ApiReq({
                url: '/setWebhook',
                method: 'POST',
                json: true,
                body: opts
            })
            .then(hook => {
                console.log(`ListenerUrl: ${hook.result} / ${hook.description}`)
            })
            .catch(this.ErrorHandler)
    }

    ReplyMessage(ChatID, text, opts = {}) {
        if (typeof ChatID === 'undefined') {
            throw new Error('You have to set "chat id" before replying.').message
            return
        }
        let reqBody = Object.assign({}, {
            chat_id: ChatID,
            text: text
        }, opts)
        this.ApiReq({
            url: '/sendMessage',
            method: 'POST',
            json: true,
            body: reqBody
        })
        .then(resp => {
            console.log('Message Sent: %j', resp)
        })
        .catch(this.ErrorHandler)
        return { message: `sending message to chat:${ChatID}...` }
    }

    ErrorHandler(err) {
        throw new Error(err)
    }

}

export default TelegramClient
