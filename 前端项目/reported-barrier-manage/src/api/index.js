import * as workOrder from './work-order/index'
import * as customForm from './custom-form/index'
import * as notice from './notice/index'
import * as file from './file/index'
import * as knowledge from './knowledge/index'
import * as common from './common'

export default {
  ...workOrder, ...customForm, ...notice, ...file, ...knowledge, common
}
