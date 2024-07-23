import { getBackgroundColor } from '@/lib/color';
import ListMember from '@/lib/model/listMember';
import { Button, Card, CardBody, Checkbox, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Select, SelectItem, User } from '@nextui-org/react';
import { SendPlus } from 'react-bootstrap-icons';

export default function MemberModal({ members, isOpen, onOpenChange }: { members: ListMember[],isOpen: boolean, onOpenChange: () => any }) {

  return (
    <Modal size='3xl' isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        { onClose => (
          <>
            <ModalHeader className='flex flex-col gap-1 text-center'>Update Members</ModalHeader>
            <ModalBody>
              <form className='flex gap-2'>
                <Input placeholder='Username...' />
                <Button color='primary' variant='ghost' className='shrink-0'><SendPlus></SendPlus>Send Invite</Button>
              </form>
              <Card className='text-xs bg-warning/20 text-warning-600'><CardBody>
                <p className='text-justify'>
                  To protect users&apos; privacy and security, confirmation that an account is 
                  associated with the provided username will only be provided if the user accepts your invitation to
                  join the list. <b>Double-check that you correctly spell the usernames before sending invites.</b>
                </p>
              </CardBody></Card>
              <table className='mt-4 w-full overflow-scroll'>
                <tr>
                  <th style={{flexGrow: 2}}>Member</th>
                  <th className='grow font-normal'>Can Add</th>
                  <th className='grow font-normal'>Can Assign</th>
                  <th className='grow font-normal'>Can Complete</th>
                  <th className='grow font-normal'>Can Remove</th>
                </tr>
                {
                  members.map(member =>
                    <tr key={member.user.id}>
                      <td className='py-2'><User name={member.user.username} avatarProps={{classNames: {base: getBackgroundColor(member.user.color)}, size: 'sm'}} /></td>
                      <td className='text-center py-2'><Checkbox isSelected={member.canAdd} /></td>
                      <td className='text-center py-2'><Checkbox isSelected={member.canAssign} /></td>
                      <td className='text-center py-2'><Checkbox isSelected={member.canComplete} /></td>
                      <td className='text-center py-2'><Checkbox isSelected={member.canRemove} /></td>
                    </tr>
                  )
                }
              </table>
            </ModalBody>
            <ModalFooter>
              <Button onPress={onClose} color='danger' variant='light'>
                Cancel
              </Button>
              <Button onPress={onClose} color='primary'>
                Save
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}