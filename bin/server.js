/**
 * 
 */

import rp from 'request-promise'
import { telegram as configs } from '../configs/configs'

class TelegramClient {

	constructor(ApiToken) {
		// console.log(process.env.npm_package_config_baseUrl)
		this.ApiReq = rp.defaults({
			baseUrl: `${configs.base_url}${ApiToken}`,
			headers: { 'Content-Type': 'application/json' }
		})
		// set hooks
		this.SetHook(configs.base_hook_url, {
            allowed_updates: ['message', 'callback_query']
        })
	}

	SetHook(url, options = {}) {
        let opts = Object.assign({}, { url: url }, options)
        this.ApiReq({
                url: '/setWebhook',
                method: 'POST',
                json: true,
                body: opts
            })
        	.then(hook => {
        		console.log(`Setting Webhook: ${hook.result} / ${hook.description}`)
        	})
            .catch(this.ErrorHandler)
    }

    SendMessage(ChatID, text, opts = {}) {
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
                debug('Message Sent: %j', resp)
            })
            .catch(this.ErrorHandler)
    }

    ErrorHandler(err) {
    	throw new Error(err)
    }

}

export default TelegramClient
