import { useEffect, useState } from "react";
import { MembershipRoles } from "shared";
import { OrganisationApi } from "../organisation.api";
import { isValidUUID } from "@/lib/validation";

type UseOrganisationRoleResult = {
  role: MembershipRoles | null;
  isOwner: boolean;
  canInvite: boolean;
  isLoading: boolean;
};

type RoleState = {
  orgId: string | undefined;
  role: MembershipRoles | null;
  isLoading: boolean;
};

export const useOrganisationRole = (
  orgId: string | undefined,
): UseOrganisationRoleResult => {
  const [state, setState] = useState<RoleState>({
    orgId,
    role: null,
    isLoading: isValidUUID(orgId),
  });

  if (state.orgId !== orgId) {
    setState({ orgId, role: null, isLoading: isValidUUID(orgId) });
  }

  useEffect(() => {
    if (!isValidUUID(orgId)) return;

    let cancelled = false;

    const getRole = async () => {
      try {
        const organisation = await OrganisationApi.getOrgbyId(orgId!);

        if (!cancelled) {
          setState((prev) => ({
            ...prev,
            role: organisation?.role ?? null,
            isLoading: false,
          }));
        }
      } catch (error) {
        console.error(error);

        if (!cancelled) {
          setState((prev) => ({ ...prev, role: null, isLoading: false }));
        }
      }
    };

    getRole();

    return () => {
      cancelled = true;
    };
  }, [orgId]);

  const isCurrent = state.orgId === orgId;
  const role = isCurrent ? state.role : null;

  return {
    role,
    isOwner: role === MembershipRoles.OWNER,
    canInvite:
      role === MembershipRoles.OWNER || role === MembershipRoles.ADMIN,
    isLoading: isCurrent ? state.isLoading : isValidUUID(orgId),
  };
};