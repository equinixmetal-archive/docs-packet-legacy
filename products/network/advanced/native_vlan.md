<p>Native VLAN feature enables support for untagged packets needed for private cloud deployment for ex with RHOS Introspection. When multiple VLANs are configured on the server port, the Native VLAN feature allows assigning one of the VLANs as native VLAN, so the packets destined for the native VLAN will always go out as untagged packets. Similarly, when the server port receives packets that are untagged, it will automatically be construed as belonging to native VLAN. This is currently supported only on non-bonded interfaces.</p>

<p>The Native VLAN feature is supported on servers with the 2-port NIC. &nbsp;Upon provisioning, all servers come up in Layer 3 mode by default. The 2-port NIC server boots up with a single bond, namely bond0 with both interfaces eth0 and eth1 configured as members of the bond. The support for this feature on 4-port NIC server such as n2.xlarge.x86 is planned.&nbsp;</p>

<p>Assigning VLANs onto the server, the server network mode needs to be changed to either Layer-2 only on Mixed Layer 2/Layer 3. In the Layer-2 only mode, VLANs can be assigned to either of the interfaces, with one of the VLANs marked as &ldquo;native&rdquo;. But, in the mixed Layer 2/Layer 3 mode, VLANs can be assigned to only the eth1 interface which is outside of the bond0 interface.&nbsp;</p>

<p>In order to set a VLAN as &ldquo;native&rdquo;, click on the &ldquo;Manage&rdquo; button next to it and follow the instructions.&nbsp;</p>

<p><img src="https://deskpro-cloud.s3.amazonaws.com/files/26944/1877/1876413QJWKNHTAKTJJHQM0-1556575862642.png" class="fr-fic fr-dii" width="624" height="323"></p>

<p><img src="https://deskpro-cloud.s3.amazonaws.com/files/26944/1877/1876412JKWSPKHYXKGGMAS0-1556575862432.png" class="fr-fic fr-dii" width="624" height="415"></p>

<p><img src="https://deskpro-cloud.s3.amazonaws.com/files/26944/1877/1876411HNMXMGJQMDGAHTQ0-1556575862198.png" class="fr-fic fr-dii" width="624" height="320"></p>

<p>The native VLAN feature is also supported <a href="https://gist.github.com/usrdev/347ccb21372da862c92c00035e4bf5a5">through the API</a>.&nbsp;</p>

<p>
	<br>
</p>
