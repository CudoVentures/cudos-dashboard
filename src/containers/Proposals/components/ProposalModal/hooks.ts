import { useSelector, useDispatch } from 'react-redux'

import { RootState } from 'store'
import { ModalProps, updateProposalsModal } from 'store/proposalsModal'

export default () => {
  const dispatch = useDispatch()
  const modal = useSelector((state: RootState) => state.proposalsModal.modal)

  const handleModal = (modalState: ModalProps) => {
    dispatch(updateProposalsModal({ modal: { ...modalState } }))
  }

  return {
    modal,
    handleModal
  }
}
