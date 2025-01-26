'use server';
import { AddressDto } from '@/app/interface/address/addressDto';
import { prisma } from '@/lib/db';
import { verifyAuth } from '@/app/core/verifyAuth';

export async function createAddress(address: AddressDto): Promise<AddressDto> {
  await verifyAuth(['ADMIN', 'USER']);
  const allAddresses: AddressDto[] = await prisma.address.findMany({
    where: {
      userId: address.userId
    },
  });

  if (allAddresses && allAddresses.length === 0) {
    address.isPrincipal = true;
  }


  try {
    return await prisma.address.create({
      data: {
        ...address,
      },
    });
  } catch (error: any) {

    throw new Error(`erreur lors de l'enregistrement de l'adresse`);
  }
}

export async function getAdressById(addressId: string, userId: string): Promise<AddressDto | void> {
  const verify = await verifyAuth(['ADMIN', 'USER']);
  if (verify && verify.user.id === userId) {
    const address: AddressDto | null = await prisma.address.findFirst({
      where: {
        userId,
        id: addressId,

      },
    });

    if (!address) {
      throw new Error(`Aucune addresse trouvée`);
    }

    return address;
  } else {
    throw new Error('User Id and owner adresses are differents');
  }
}

export async function updateAdress(address: AddressDto): Promise<AddressDto | void> {

  const verify = await verifyAuth(['ADMIN', 'USER']);
  if (verify && verify.user.id === address.userId) {
    return prisma.address.update({
      where: {
        id: address.id,

      },
      data: {
        isPrincipal: address.isPrincipal,
        name: address.name,
        address: address.address,
        additionalAddress: address.additionalAddress,
        zipCode: address.zipCode,
        city: address.city,
        phoneNumber: address.phoneNumber,
        note: address.note,
      },
    });
  } else {
    throw new Error('User Id and owner adress is different');
  }

}

export async function deleteAdress(id: string, userId: string | undefined): Promise<AddressDto> {
  if (!userId) {
    throw new Error('User Id is not defined');
  }

  const verify = await verifyAuth(['ADMIN', 'USER']);
  if (verify && verify.user.id === userId) {
    return prisma.address.delete({
      where: { id }
    });
  } else {
    throw new Error('User Id and owner adress is different');
  }

}
